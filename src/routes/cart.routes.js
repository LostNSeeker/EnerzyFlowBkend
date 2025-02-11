import express from 'express';
import { auth } from '../middleware/auth.js';
import * as cartController from '../controllers/order/cart.controller.js';

const router = express.Router();

router.get('/', auth, cartController.getCart);
router.post('/add', auth, validate(cartValidation), cartController.addToCart);
router.put('/update/:itemId', auth, cartController.updateCartItem);
router.delete('/remove/:itemId', auth, cartController.removeFromCart);
router.post('/apply-promo', auth, cartController.applyPromoCode);

export default router;