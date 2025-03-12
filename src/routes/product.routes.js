import express from "express";
import { auth } from "../middleware/auth.js";
import { cache } from "../middleware/cache.js";
import * as productController from "../controllers/product/product.controller.js";
import { validate } from "../middleware/validation.js";
import { reviewValidation } from "../validators/product.validators.js";
import multer from 'multer';
const upload = multer();

const router = express.Router();

router.get("/",auth, cache(300), productController.getProducts);
router.get("/search", productController.searchProducts);//not emplimented till now
router.get(
	"/category/:category",
	auth,
	cache(300),
	productController.getProductsDetailsByCategory
);
router.get("/:id",auth, productController.getProductById);
router.post(
	"/:id/review",
	auth,
	upload.none(), // to parse multipart form data
	validate(reviewValidation),
	productController.addReview
);

export default router;
