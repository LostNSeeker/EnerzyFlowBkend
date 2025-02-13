import { check } from "express-validator";

export const reviewValidation = [
	check("rating")
		.isInt({ min: 1, max: 5 })
		.withMessage("Rating must be between 1 and 5"),
	check("comment")
		.optional()
		.isString()
		.withMessage("Comment must be a string"),
];
