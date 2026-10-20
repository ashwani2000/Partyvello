import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import User from '../models/User.js';
import { appData, sanitizeUser } from '../utils/store.js';

export const protect = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'party-nest-demo-secret');

    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({
        $or: [{ _id: decoded.id }, { email: decoded.email }],
      }).lean();
    }

    if (!user) {
      user = appData.users.find((item) => item.id === decoded.id || item.email === decoded.email);
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = sanitizeUser(user);
    if (req.user.role === 'wholesaler' && req.user.status !== 'approved') {
      return res.status(403).json({ message: 'Wholesale account access requires admin approval.' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied for this role.' });
  }

  next();
};
