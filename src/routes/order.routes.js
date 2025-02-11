import express from 'express';
import { auth } from '../middleware/auth.js';
import * as orderController from '../controllers/order/order.controller.js';

const router = express.Router();

router.post('/', auth, validate(orderValidation), orderController.createOrder);
router.get('/', auth, orderController.getOrders);
router.get('/:id', auth, orderController.getOrderDetails);
router.post('/:id/cancel', auth, orderController.cancelOrder);
router.get('/ongoing', auth, orderController.getOngoingOrders);
router.get('/completed', auth, orderController.getCompletedOrders);

export default router;