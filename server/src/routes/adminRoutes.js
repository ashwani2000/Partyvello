import express from 'express';

import {
  getDashboardStats,
  getUsers,
  updateUserStatus,
} from '../controllers/adminController.js';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../controllers/productController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);

export default router;
