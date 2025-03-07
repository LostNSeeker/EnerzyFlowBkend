import express from "express";
import { auth } from "../middleware/auth.js";
import * as orderController from "../controllers/order/order.controller.js";
import { validate } from "../middleware/validation.js";
import { orderValidation } from "../validators/order.validators.js";

const router = express.Router();

router.post(
  "/",
  
  validate(orderValidation),
  orderController.createNewOrder
);//many fields are not included
router.get("/",  orderController.getUserOrders); //use pagination
router.get("/ongoing",  orderController.getOngoingOrders);
router.get("/completed",  orderController.getCompletedOrders);
router.get("/:id",  orderController.getOrderDetails); //logc not defined in function
router.post("/:id/cancel",  orderController.cancelOrder);

export default router;
