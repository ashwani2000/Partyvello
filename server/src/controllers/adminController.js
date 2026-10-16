import mongoose from 'mongoose';

import User from '../models/User.js';
import { appData } from '../utils/store.js';

export const getUsers = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find().sort({ createdAt: -1 }).lean();
      return res.json({ users, total: users.length });
    }

    return res.json({ users: appData.users, total: appData.users.length });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'approved', 'rejected', 'suspended'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid user status.' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      user.status = status;
      await user.save();
      return res.json({ message: 'User status updated successfully.', user });
    }

    const index = appData.users.findIndex((user) => user.id === req.params.id || user._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    appData.users[index].status = status;
    return res.json({ message: 'User status updated successfully.', user: appData.users[index] });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const [userCount, productCount] = await Promise.all([
        User.countDocuments(),
        (await import('../models/Product.js')).default.countDocuments(),
      ]);

      return res.json({ stats: { users: userCount, products: productCount } });
    }

    return res.json({
      stats: {
        users: appData.users.length,
        products: appData.products.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
