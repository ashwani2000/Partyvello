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
  if (role === 'admin' || role === 'retailer' || role === 'wholesaler') {
    return role;
  }

  return 'retailer';
};

const ensureLowerEmail = (email) => (email ? email.toLowerCase() : email);

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
    await ensureDefaultAdmin();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

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

      if (user.status === 'suspended') {
        return res.status(403).json({ message: 'This account has been suspended.' });
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

    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'This account has been suspended.' });
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
