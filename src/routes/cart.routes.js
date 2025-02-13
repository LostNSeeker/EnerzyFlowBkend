import express from "express";
import { auth } from "../middleware/auth.js";
import * as cartController from "../controllers/order/cart.controller.js";
import { validate } from "../middleware/validation.js";
import {
  cartValidation,
  promoCodeValidation,
} from "../validators/cart.validators.js";

const router = express.Router();

router.get("/", auth, cartController.getCart);
router.post("/add", auth, validate(cartValidation), cartController.addToCart);
router.put("/update/:itemId", auth, cartController.updateCartItem);
router.delete("/remove/:itemId", auth, cartController.removeFromCart);
router.post(
  "/apply-promo",
  auth,
  validate(promoCodeValidation),
  cartController.applyPromoCode
);

export default router;
