import { check } from "express-validator";

export const profileValidation = [
  check("businessName")
    .optional()
    .isString()
    .withMessage("Business name must be a string"),
  check("businessType")
    .optional()
    .isString()
    .withMessage("Business Type must be a string"),
  check("businessAddress")
    .optional()
    .isString()
    .withMessage("Business address must be a string"),
  check("city").optional().isString().withMessage("City must be a string"),
  check("state").optional().isString().withMessage("State must be a string"),
  check("pinCode")
    .optional()
    .isPostalCode("any")
    .withMessage("Pin code must be a valid postal code"),
];
