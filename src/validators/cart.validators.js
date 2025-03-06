import { check } from "express-validator";

export const cartValidation = [
	check("productId").notEmpty().withMessage("Product ID is required"),
	check("quantity")
		.isInt({ min: 1 })
		.withMessage("Quantity must be at least 1"),
];

export const promoCodeValidation = [
	check("promoCode").notEmpty().withMessage("Promo code is required"),
];
