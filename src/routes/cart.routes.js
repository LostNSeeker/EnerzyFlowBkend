import express from "express";
import { auth } from "../middleware/auth.js";
import * as cartController from "../controllers/order/cart.controller.js";
import { validate } from "../middleware/validation.js";
import {
  cartValidation,
  promoCodeValidation,
} from "../validators/cart.validators.js";
import multer from "multer";
const upload = multer();

const router = express.Router();

router.get("/", 
  // auth,
   cartController.getCart);
router.post(
  "/add",
  // auth,
  upload.none(), // to parse multipart form data
  validate(cartValidation),
  cartController.addToCart
);
router.put(
  "/update",
  // auth,
  upload.none(), // to parse multipart form data
  cartController.updateCartItem
);
router.delete("/remove/:productId",
  //  auth,
    cartController.removeFromCart);
router.post(
  "/apply-promo",
  // auth,
  upload.none(),
  validate(promoCodeValidation),
  cartController.applyPromoCode
);//promocode model and logic not implemented yet

export default router;
