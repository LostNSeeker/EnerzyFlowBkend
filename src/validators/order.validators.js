import { check } from "express-validator";

export const orderValidation = [
	check("shippingAddress")
		.notEmpty()
		.withMessage("Shipping address is required"),
	check("paymentMethod").notEmpty().withMessage("Payment method is required"),
];
