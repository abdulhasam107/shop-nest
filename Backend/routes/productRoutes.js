import express from "express";
import { protect } from "../middleware/authMiddle.js";
import { admin } from "../middleware/adminMiddle.js";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js"; 
const router = express.Router();
import multer from "multer";
const upload = multer({ dest: 'uploads/' }); // Configure multer to save files to the 'uploads' directory

router.route('/').get(getProducts).post(protect, admin, upload.single('image'), createProduct);
router.route('/:id').get(getProductById).put(protect, admin, upload.single('image'), updateProduct).delete(protect, admin, deleteProduct);

export default router; 