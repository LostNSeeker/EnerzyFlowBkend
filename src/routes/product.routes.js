import express from "express";
import { auth } from "../middleware/auth.js";
import { cache } from "../middleware/cache.js";
import * as productController from "../controllers/product/product.controller.js";
import { validate } from "../middleware/validation.js";
import { reviewValidation } from "../validators/product.validators.js";

const router = express.Router();

router.get("/", cache(300), productController.getProducts);
router.get(
	"/category/:category",
	cache(300),
	productController.getProductsDetailsByCategory
);
router.get("/:id", productController.getProductById);
router.post(
	"/:id/review",
	auth,
	validate(reviewValidation),
	productController.addReview
);
router.get("/search", productController.searchProducts);

export default router;
