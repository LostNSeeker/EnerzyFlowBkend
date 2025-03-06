import { check } from "express-validator";

export const reviewValidation = [
	check("rating")
	.customSanitizer(value => {
	  // More robust conversion with fallback
	  const parsed = typeof value === 'string' ? Number(value) : value;
	  return isNaN(parsed) ? null : parsed; // Return null if NaN
	})
	.isInt({ min: 1, max: 5 })
	.withMessage("Rating must be between 1 and 5"),
  
  check("comment")
    .optional()
    .isString()
    .withMessage("Comment must be a string"),
];
