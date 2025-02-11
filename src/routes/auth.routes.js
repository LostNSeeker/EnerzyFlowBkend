import express from 'express';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validation.js';
import { auth } from '../middleware/auth.js';
import * as authController from '../controllers/auth/login.controller.js';

const router = express.Router();

router.post('/login', authLimiter, validate(loginValidation), authController.login);
router.post('/verify-otp', validate(otpValidation), authController.verifyOTP);
router.post('/profile-setup', auth, validate(profileValidation), authController.setupProfile);
router.post('/kyc-upload', auth, upload.single('document'), authController.uploadKYC);

export default router;
