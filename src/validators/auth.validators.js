import { check } from "express-validator";

export const loginValidation = [
	check("phoneNumber")
		.isMobilePhone()
		.withMessage("Invalid phone number format"),
	check("vendorId").notEmpty().withMessage("Vendor ID is required"),
];

export const otpValidation = [
	check("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
];

export const profileValidation = [
	check("name").notEmpty().withMessage("Name is required"),
	check("vendor").notEmpty().withMessage("Invalid Vendor ID format"),
];
