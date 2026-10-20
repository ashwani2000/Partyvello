import mongoose from 'mongoose';

import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { appData, sanitizeUser } from '../utils/store.js';

export const getUsers = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find().sort({ createdAt: -1 }).lean();
      const safeUsers = users.map(sanitizeUser);
      return res.json({ users: safeUsers, total: safeUsers.length });
    }

    const safeUsers = appData.users.map(sanitizeUser);
    return res.json({ users: safeUsers, total: safeUsers.length });
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
      return res.json({ message: 'User status updated successfully.', user: sanitizeUser(user) });
    }

    const index = appData.users.findIndex((user) => user.id === req.params.id || user._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    appData.users[index].status = status;
    return res.json({ message: 'User status updated successfully.', user: sanitizeUser(appData.users[index]) });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const [userCount, productCount, pendingWholesalers, orderCount, revenueResult] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        User.countDocuments({ role: 'wholesaler', status: 'pending' }),
        Order.countDocuments(),
        Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      ]);

      return res.json({
        stats: {
          users: userCount,
          products: productCount,
          pendingWholesalers,
          orders: orderCount,
          revenue: revenueResult[0]?.total || 0,
        },
      });
    }

    return res.json({
      stats: {
        users: appData.users.length,
        products: appData.products.length,
        pendingWholesalers: appData.users.filter((user) => user.role === 'wholesaler' && user.status === 'pending').length,
        orders: appData.orders.length,
        revenue: appData.orders.reduce((total, order) => total + Number(order.total || 0), 0),
      },
    });
  } catch (error) {
    next(error);
  }
};
