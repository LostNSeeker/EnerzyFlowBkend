import express from "express";
import { auth } from "../middleware/auth.js";
import * as orderController from "../controllers/order/order.controller.js";
import { validate } from "../middleware/validation.js";
import { orderValidation } from "../validators/order.validators.js";

const router = express.Router();

router.post(
  "/",
  auth,
  validate(orderValidation),
  orderController.createNewOrder
);//many fields are not included
router.get("/", auth, orderController.getUserOrders); //use pagination
router.get("/:id", auth, orderController.getOrderDetails); //logc not defined in function
router.post("/:id/cancel", auth, orderController.cancelOrder);
router.get("/ongoing", auth, orderController.getOngoingOrders);
router.get("/completed", auth, orderController.getCompletedOrders);

export default router;
