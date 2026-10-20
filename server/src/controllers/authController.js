import { createHash, timingSafeEqual } from 'node:crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import User from '../models/User.js';
import { appData, comparePassword, createToken, hashPassword, sanitizeUser } from '../utils/store.js';
import { ensureDefaultAdmin } from '../utils/seedAdmin.js';

const authCookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production',
};

const normalizeRole = (role) => {
  return role === 'wholesaler' ? 'wholesaler' : 'retailer';
};

const ensureLowerEmail = (email) => (email ? email.toLowerCase() : email);

const getLoginAccessError = (user) => {
  if (user.status === 'suspended') {
    return 'This account has been suspended.';
  }
  if (user.role === 'wholesaler' && user.status !== 'approved') {
    return user.status === 'pending'
      ? 'Your wholesale account is awaiting admin approval.'
      : 'Your wholesale application has not been approved.';
  }
  return null;
};

const getPortalAccessError = (user, portal) => {
  if (portal === 'admin' && user.role !== 'admin') {
    return 'These credentials do not have administrator access.';
  }
  if (portal !== 'admin' && user.role === 'admin') {
    return 'Use the admin sign-in link in the footer to access this account.';
  }
  if (['retailer', 'wholesaler'].includes(portal) && user.role !== portal) {
    return `These credentials do not belong to a ${portal} account.`;
  }
  return null;
};

const isValidAdminGateToken = (token) => {
  if (!token) return false;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'party-nest-demo-secret');
    return payload.purpose === 'admin-gate';
  } catch {
    return false;
  }
};

export const verifyAdminGate = (req, res) => {
  const configuredPin = process.env.ADMIN_GATE_PIN;
  if (!configuredPin) {
    return res.status(503).json({ message: 'Admin gate is not configured on the server.' });
  }

  const { pin } = req.body;
  if (typeof pin !== 'string' || pin.length === 0 || pin.length > 128) {
    return res.status(400).json({ message: 'Enter the admin access PIN.' });
  }

  const expected = createHash('sha256').update(configuredPin).digest();
  const supplied = createHash('sha256').update(pin).digest();
  if (!timingSafeEqual(expected, supplied)) {
    return res.status(401).json({ message: 'Incorrect admin access PIN.' });
  }

  const gateToken = jwt.sign({ purpose: 'admin-gate' }, process.env.JWT_SECRET || 'party-nest-demo-secret', {
    expiresIn: '5m',
  });
  return res.json({ gateToken });
};

export const register = async (req, res, next) => {
  try {
    await ensureDefaultAdmin();
    const { role = 'retailer', fullName, businessName, companyName, businessAddress, email, password, phone, city, state, postalCode, gstin } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const normalizedRole = normalizeRole(role);
    const normalizedEmail = ensureLowerEmail(email);

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(409).json({ message: 'An account with this email already exists.' });
      }

      const newUser = await User.create({
        fullName,
        email: normalizedEmail,
        password: await hashPassword(password),
        role: normalizedRole,
        status: normalizedRole === 'wholesaler' ? 'pending' : 'approved',
        businessName: businessName || '',
        companyName: companyName || '',
        businessAddress: businessAddress || '',
        phone: phone || '',
        city: city || '',
        state: state || '',
        postalCode: postalCode || '',
        gstin: gstin || '',
      });

      const token = createToken(newUser);
      res.cookie('token', token, authCookieOptions);

      return res.status(201).json({
        message: normalizedRole === 'wholesaler' ? 'Wholesale registration received. Admin approval is required.' : 'Registration successful.',
        user: sanitizeUser(newUser),
        token,
      });
    }

    const existingUser = appData.users.find((user) => user.email.toLowerCase() === normalizedEmail.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hashed = await hashPassword(password);
    const newUser = {
      id: `user-${Date.now()}`,
      fullName,
      businessName: businessName || '',
      companyName: companyName || '',
      businessAddress: businessAddress || '',
      email: normalizedEmail,
      password: hashed,
      phone: phone || '',
      city: city || '',
      state: state || '',
      postalCode: postalCode || '',
      gstin: gstin || '',
      role: normalizedRole,
      status: normalizedRole === 'wholesaler' ? 'pending' : 'approved',
      createdAt: new Date().toISOString(),
    };

    appData.users.push(newUser);
    const token = createToken(newUser);
    res.cookie('token', token, authCookieOptions);

    res.status(201).json({
      message: normalizedRole === 'wholesaler' ? 'Wholesale registration received. Admin approval is required.' : 'Registration successful.',
      user: sanitizeUser(newUser),
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, portal } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    if (portal === 'admin' && !isValidAdminGateToken(req.get('X-Admin-Gate-Token'))) {
      return res.status(403).json({ message: 'Complete the admin PIN check before signing in.' });
    }

    await ensureDefaultAdmin();

    const normalizedEmail = ensureLowerEmail(email);

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      const accessError = getLoginAccessError(user);
      if (accessError) {
        return res.status(403).json({ message: accessError });
      }
      const portalError = getPortalAccessError(user, portal);
      if (portalError) {
        return res.status(403).json({ message: portalError });
      }

      const token = createToken(user);
      res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });

      return res.json({
        message: 'Login successful.',
        user: sanitizeUser(user),
        token,
      });
    }

    const user = appData.users.find((item) => item.email.toLowerCase() === normalizedEmail.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const accessError = getLoginAccessError(user);
    if (accessError) {
      return res.status(403).json({ message: accessError });
    }
    const portalError = getPortalAccessError(user, portal);
    if (portalError) {
      return res.status(403).json({ message: portalError });
    }

    const token = createToken(user);
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });

    res.json({
      message: 'Login successful.',
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie('token', authCookieOptions);
  res.json({ message: 'Logged out successfully.' });
};

export const getCurrentUser = (req, res) => {
  res.json({ user: req.user });
};
