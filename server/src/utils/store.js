import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { demoUsers, demoProducts, demoOrders, demoInquiries } from '../data/mockData.js';
import { budgetProducts } from '../data/budgetProducts.js';

export const appData = {
  users: structuredClone(demoUsers),
  products: structuredClone([...demoProducts, ...budgetProducts]),
  orders: structuredClone(demoOrders),
  inquiries: structuredClone(demoInquiries),
};

export const createToken = (user) =>
  jwt.sign({ id: user.id || String(user._id || user.id), email: user.email, role: user.role }, process.env.JWT_SECRET || 'party-nest-demo-secret', {
    expiresIn: '7d',
  });

export const hashPassword = async (password) => bcrypt.hash(password, 10);
export const comparePassword = async (password, hashedPassword) => bcrypt.compare(password, hashedPassword);

export const sanitizeUser = (user) => {
  if (!user) return null;
  const data = user.toObject ? user.toObject() : { ...user };
  const { password, _id, __v, ...safeUser } = data;
  return {
    ...safeUser,
    id: safeUser.id || String(_id || safeUser._id || 'unknown'),
  };
};
