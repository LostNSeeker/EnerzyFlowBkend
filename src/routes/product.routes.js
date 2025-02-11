import express from 'express';
import { auth } from '../middleware/auth.js';
import { cache } from '../middleware/cache.js';
import * as productController from '../controllers/product/product.controller.js';

const router = express.Router();

router.get('/', cache(300), productController.getAllProducts);
router.get('/category/:category', cache(300), productController.getProductsByCategory);
router.get('/:id', productController.getProductDetails);
router.post('/:id/review', auth, validate(reviewValidation), productController.addReview);
router.get('/search', productController.searchProducts);

export default router;