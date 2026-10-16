import express from 'express';
import { createInquiry, getInquiries } from '../controllers/contactController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createInquiry);
router.get('/', protect, authorize('admin'), getInquiries);

export default router;
