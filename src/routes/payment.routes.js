import express from 'express';
import { auth } from '../middleware/auth.js';
import * as paymentController from '../controllers/order/payment.controller.js';

const router = express.Router();

router.post('/create-order', auth, paymentController.createPaymentOrder);
router.post('/verify', auth, paymentController.verifyPayment);
router.post('/cod-confirm', auth, paymentController.confirmCashOnDelivery);

export default router;