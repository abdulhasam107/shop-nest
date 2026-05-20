import express from 'express';
import { protect } from '../middleware/authMiddle.js';
import { admin } from '../middleware/adminMiddle.js';
import { getadminstates } from '../controllers/analyticsController.js';


const router = express.Router();

router.get('/', protect, admin, getadminstates);

export default router;