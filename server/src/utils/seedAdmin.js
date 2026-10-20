import mongoose from 'mongoose';

import User from '../models/User.js';
import { appData, hashPassword } from './store.js';

export const ensureDefaultAdmin = async () => {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@partypops.com').toLowerCase();
  const configuredAdminPassword = process.env.ADMIN_PASSWORD;
  const adminPassword = configuredAdminPassword || 'Admin@123';

  if (mongoose.connection.readyState === 1) {
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      existing.role = 'admin';
      existing.status = 'approved';
      if (
        configuredAdminPassword
        || (existing.password && !existing.password.startsWith('$2'))
      ) {
        existing.password = await hashPassword(adminPassword);
      }
      await existing.save();
      return existing;
    }

    const newAdmin = await User.create({
      fullName: 'Party Vello Admin',
      email: adminEmail,
      password: await hashPassword(adminPassword),
      role: 'admin',
      status: 'approved',
      businessName: 'Party Vello',
    });

    return newAdmin;
  }

  const existing = appData.users.find((user) => user.email.toLowerCase() === adminEmail);
  if (existing) {
    existing.role = 'admin';
    existing.status = 'approved';
    existing.password = await hashPassword(adminPassword);
    return existing;
  }

  const createdAdmin = {
    id: 'admin-1',
    fullName: 'Party Vello Admin',
    email: adminEmail,
    password: await hashPassword(adminPassword),
    role: 'admin',
    status: 'approved',
    createdAt: new Date().toISOString(),
  };

  appData.users.unshift(createdAdmin);
  return createdAdmin;
};
