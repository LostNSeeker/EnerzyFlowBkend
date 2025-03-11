import express from "express";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validation.js";
import { auth } from "../middleware/auth.js";
import * as authController from "../controllers/auth/login.controller.js";
import {
	loginValidation,
	otpValidation,
	profileValidation,
} from "../validators/auth.validators.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post(
	"/login",
	authLimiter,
	validate(loginValidation),
	authController.login
);
router.post("/verify-otp", validate(otpValidation), authController.verifyOTP);
router.post(
	"/profile-setup",
	upload.single("document"),
	validate(profileValidation),
	authController.setupProfile
);
router.post(
	"/kyc-upload",
	auth,
	upload.single("document"),
	authController.uploadKYC
);

export default router;
