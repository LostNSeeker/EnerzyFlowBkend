import {
	createOrder,
	getOrderById,
	getOrders,
	updateOrderStatus,
} from "../../services/order.service.js";
import { sendOrderConfirmation } from "../../services/notification.service.js";

export const createNewOrder = async (req, res) => {
	try {
		const { shippingAddress, paymentMethod } = req.body;

		const order = await createOrder(req.user._id, {
			shippingAddress,
			paymentMethod,
		});

		// Send order confirmation
		await sendOrderConfirmation(
			req.user.phoneNumber,
			order._id,
			order.totalAmount
		);

		res.status(201).json({
			success: true,
			message: "Order created successfully",
			data: order,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Failed to create order",
		});
	}
};

export const getUserOrders = async (req, res) => {
	try {
		const { status } = req.query;
		const orders = await getOrders(req.user._id, status);

		res.status(200).json({
			success: true,
			data: orders,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Failed to fetch orders",
		});
	}
};

export const getOrderDetails = async (req, res) => {
	try {
		const order = await getOrderById(req.params.id);//funtion not difined

		res.status(200).json({
			success: true,
			data: order,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Failed to fetch order details",
		});
	}
};

export const cancelOrder = async (req, res) => {
	try {
		const order = await updateOrderStatus(req.params.id, "cancelled");

		res.status(200).json({
			success: true,
			message: "Order cancelled successfully",
			data: order,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Failed to cancel order",
		});
	}
};

export const getOngoingOrders = async (req, res) => {
	try {
		const orders = await getOrders("67c6d4b293af3b4005834f2d", "ongoing");//req.user._id

		res.status(200).json({
			success: true,
			data: orders,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Failed to fetch ongoing orders",
		});
	}
};

export const getCompletedOrders = async (req, res) => {
	try {
		const orders = await getOrders("67c6d4b293af3b4005834f2d", "completed");//req.user._id

		res.status(200).json({
			success: true,
			data: orders,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Failed to fetch completed orders",
		});
	}
};
