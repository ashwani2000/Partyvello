import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { demoProducts } from '../data/mockData.js';
import { budgetProducts } from '../data/budgetProducts.js';

export const ensureDemoProducts = async () => {
  if (mongoose.connection.readyState !== 1) return;

  const operations = [...demoProducts, ...budgetProducts].map(({ id, ...product }) => ({
    updateOne: {
      filter: { sku: product.sku },
      update: { $setOnInsert: product },
      upsert: true,
    },
  }));

  await Product.bulkWrite(operations);
};
