import mongoose from 'mongoose';

import Product from '../models/Product.js';
import { appData } from '../utils/store.js';

const normalizeProductPayload = (body) => ({
  name: body.name?.trim(),
  sku: body.sku?.trim(),
  category: body.category?.trim(),
  price: Number(body.price),
  wholesalePrice: body.wholesalePrice !== undefined ? Number(body.wholesalePrice) : Number(body.price),
  stock: Number(body.stock || 0),
  description: body.description || '',
  image: body.image || '',
  rating: Number(body.rating || 4.5),
  available: body.available !== undefined ? Boolean(body.available) : true,
});

export const getProducts = async (req, res, next) => {
  try {
    const { category, search, sort, minPrice, maxPrice, available } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = {};

      if (category) {
        query.category = new RegExp(String(category), 'i');
      }

      if (search) {
        query.$or = [
          { name: new RegExp(String(search), 'i') },
          { sku: new RegExp(String(search), 'i') },
        ];
      }

      if (minPrice) {
        query.price = { ...query.price, $gte: Number(minPrice) };
      }

      if (maxPrice) {
        query.price = { ...query.price, $lte: Number(maxPrice) };
      }

      if (available === 'true') {
        query.available = true;
        query.stock = { $gt: 0 };
      }

      const products = await Product.find(query).sort({ createdAt: -1 });
      const ordered = sort === 'price-low'
        ? [...products].sort((a, b) => a.price - b.price)
        : sort === 'price-high'
          ? [...products].sort((a, b) => b.price - a.price)
          : sort === 'popularity'
            ? [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0))
            : products;

      return res.json({ items: ordered, total: ordered.length });
    }

    let products = [...appData.products];

    if (category) {
      products = products.filter((product) => product.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      const value = search.toLowerCase();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(value) ||
          product.sku.toLowerCase().includes(value),
      );
    }

    if (minPrice) {
      products = products.filter((product) => product.price >= Number(minPrice));
    }

    if (maxPrice) {
      products = products.filter((product) => product.price <= Number(maxPrice));
    }

    if (available === 'true') {
      products = products.filter((product) => product.available && product.stock > 0);
    }

    if (sort === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'popularity') {
      products.sort((a, b) => b.rating - a.rating);
    }

    return res.json({ items: products, total: products.length });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      return res.json({ product });
    }

    const product = appData.products.find((item) => item.id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json({ product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const payload = normalizeProductPayload(req.body);

    if (!payload.name || !payload.category || !payload.sku || !payload.price) {
      return res.status(400).json({ message: 'Product name, category, sku, and price are required.' });
    }

    if (mongoose.connection.readyState === 1) {
      const existing = await Product.findOne({ sku: payload.sku });
      if (existing) {
        return res.status(409).json({ message: 'A product with this SKU already exists.' });
      }

      const product = await Product.create(payload);
      return res.status(201).json({ message: 'Product created successfully.', product });
    }

    const newProduct = {
      id: `prod-${Date.now()}`,
      ...payload,
      available: payload.stock > 0 || payload.available,
    };

    appData.products.push(newProduct);
    return res.status(201).json({ message: 'Product created successfully.', product: newProduct });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      Object.assign(product, normalizeProductPayload({ ...product.toObject(), ...req.body }));
      await product.save();

      return res.json({ message: 'Product updated successfully.', product });
    }

    const index = appData.products.findIndex((item) => item.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const existing = appData.products[index];
    const merged = { ...existing, ...req.body };
    merged.price = Number(merged.price);
    merged.stock = Number(merged.stock || 0);
    merged.available = merged.available !== undefined ? Boolean(merged.available) : merged.stock > 0;
    appData.products[index] = merged;

    return res.json({ message: 'Product updated successfully.', product: merged });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const deleted = await Product.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      return res.json({ message: 'Product deleted successfully.' });
    }

    const index = appData.products.findIndex((item) => item.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    appData.products.splice(index, 1);
    return res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
