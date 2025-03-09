import {
	createPaymentOrder,
	processPayment,
} from "../../services/payment.service.js";
import { sendOrderConfirmation } from "../../services/notification.service.js";
import Order from "../../models/Order.js";

export const initiatePayment = async (req, res) => {
	try {
		const { orderId, amount } = req.body;

		const paymentOrder = await createPaymentOrder(amount, orderId);

		res.status(200).json({
			success: true,
			data: paymentOrder,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Payment initiation failed",
		});
	}
};

export const verifyPayment = async (req, res) => {
	try {
		const { orderId, paymentId, signature } = req.body;

		const order = await processPayment(orderId, paymentId, signature);

		// Send confirmation	//testing
		// await sendOrderConfirmation(
		// 	req.user.phoneNumber,
		// 	order._id,
		// 	order.totalAmount
		// );

		res.status(200).json({
			success: true,
			message: "Payment verified successfully",
			data: order,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Payment verification failed",
		});
	}
};

export const confirmCashOnDelivery = async (req, res) => {
	try {
		const _id = req.body.orderId;
		if (!_id) {
		  return res.status(400).json({ 
			success: false, 
			message: "Order ID is required" 
		  });
		}
	
		const order = await Order.findById(_id);
	
		if (!order) {
		  return res.status(404).json({ 
			success: false, 
			message: "Order not found" 
		  });
		}

		if (order.paymentMethod !== "cash") {
		  return res.status(400).json({ 
			success: false, 
			message: "This function is only for cash on delivery orders" 
		  });
		}
	
		order.orderStatus = "confirmed";
		await order.save();

		// Send confirmation	//testing
		// await sendOrderConfirmation(
		// 	req.user.phoneNumber,
		// 	order._id,
		// 	order.totalAmount
		// );

		res.status(200).json({
			success: true,
			message: "Order confirmed successfully",
			data: order,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Order confirmation failed",
		});
	}
};
