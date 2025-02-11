import express from 'express';
import { auth } from '../middleware/auth.js';
import * as userController from '../controllers/user/profile.controller.js';

const router = express.Router();

router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, validate(profileValidation), userController.updateProfile);
router.get('/coins', auth, userController.getCoinsBalance);
router.post('/refer', auth, userController.referFriend);
router.get('/referrals', auth, userController.getReferralHistory);

export default router;
