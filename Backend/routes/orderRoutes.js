import express from 'express';
import { protect } from '../middleware/authMiddle.js';
import { admin } from '../middleware/adminMiddle.js';

import {
    createOrder,
    getAllOrders,
    getOrdersById,
    updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();

router.route('/')
    .post(protect, createOrder)
    .get(protect, admin, getAllOrders);

router.route('/myorders')
    .get(protect, getOrdersById);

router.route('/:id/status')
    .put(protect, admin, updateOrderStatus);

export default router;