import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, logout, getCurrentUser, verifyAdminGate } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const adminGateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many PIN attempts. Try again in 15 minutes.' },
});

router.post('/register', register);
router.post('/admin-gate', adminGateLimiter, verifyAdminGate);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getCurrentUser);

export default router;
