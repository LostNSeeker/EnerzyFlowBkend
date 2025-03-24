// File: backend/routes/adminRoutes.js
import express from 'express';
import { protect } from '../middleware/adminAuth.js';

// Import controllers
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/admin/users.js';

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/admin/product.js';

import {
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} from '../controllers/admin/order.js';

import {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/admin/coupons.js';

import {
  getDashboardStats
} from '../controllers/admin/dashboard.js';
import { login } from '../controllers/admin/auth.js';

const router = express.Router();

router.route('/login')
  .post(login);

// Protect all routes
router.use(protect);


// User routes
router.route('/users')
  .get(getUsers)
  .post(createUser);

router.route('/users/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// Product routes
router.route('/products')
  .get(getProducts)
  .post(createProduct);

router.route('/products/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

// Order routes
router.route('/orders')
  .get(getOrders);

router.route('/orders/:id')
  .get(getOrderById)
  .delete(deleteOrder);//not in admin panel till now 24 march

router.route('/orders/:id/status')
  .patch(updateOrderStatus);

// Coupon routes
router.route('/coupons')
  .get(getCoupons)
  .post(createCoupon);

router.route('/coupons/:id')
  .get(getCouponById)
  .put(updateCoupon)
  .delete(deleteCoupon);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);

export default router;