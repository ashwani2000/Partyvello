import express from 'express';
import { createOrder, getOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getOrders);
router.post('/', protect, createOrder);

export default router;
