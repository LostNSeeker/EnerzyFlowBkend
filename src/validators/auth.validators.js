import { check } from "express-validator";

export const loginValidation = [
	check("phoneNumber")
		.isMobilePhone()
		.withMessage("Invalid phone number format"),
	check("vendorId").notEmpty().withMessage("Vendor ID is required"),
];

export const otpValidation = [
	check("otp").isLength({ min: 4, max: 4 }).withMessage("OTP must be 4 digits"),
];

export const profileValidation = [
  check("name")
    .notEmpty().withMessage("Name is required")
    .trim(),
  check("phoneNumber")
    .notEmpty().withMessage("Phone number is required")
    .trim()
    .isLength({ min: 10, max: 10 }).withMessage("Phone number must be exactly 10 digits")
    .isNumeric().withMessage("Phone number must contain only digits"),
  check("businessName")
    .notEmpty().withMessage("Business name is required")
    .trim(),
  check("businessType")
    .notEmpty().withMessage("Business type is required")
    .trim(),
  check("businessAddress")
    .notEmpty().withMessage("Business address is required")
    .trim(),
  check("city")
    .notEmpty().withMessage("City is required")
    .trim(),
  check("pinCode")
    .notEmpty().withMessage("PIN code is required")
    .trim()
    .isLength({ min: 6, max: 6 }).withMessage("PIN code must be exactly 6 digits")
    .isNumeric().withMessage("PIN code must contain only digits"),
  check("state")
    .notEmpty().withMessage("State is required")
    .trim(),
  check("kycDocName")
    .notEmpty().withMessage("KYC document name is required")
    .trim(),
];