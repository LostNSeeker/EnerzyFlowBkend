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
    .isLength({ min: 10, max: 15 }).withMessage("Phone number must be between 10 and 15 characters"),
  
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
    .trim(),
  
  check("state")
    .notEmpty().withMessage("State is required")
    .trim(),
  
  check("kycDocName")
    .notEmpty().withMessage("KYC document name is required")
    .trim(),
];
