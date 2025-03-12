import {
	calculateTotalAmount,
	createOrder,
	getOrderById,
	getOrders,
	updateOrderStatus,
} from "../../services/order.service.js";
import { sendOrderConfirmation } from "../../services/notification.service.js";
import Coupon from "../../models/Coupern.js";
import Cart from "../../models/Cart.js";
import User from "../../models/User.js";

export const createNewOrder = async (req, res) => {
	try {
	  console.log("Inside createNewOrder with user id", req.user._id);
	  const { shippingAddress, paymentMethod, promoCode } = req.body;
	  const userId = req.user?._id; 
	  
	  // Initialize appliedCoupon to null
	  let appliedCoupon = null;
	  
	  // If promoCode is provided in the request body, process it
	  if (promoCode) {
		// Find the coupon in database
		const coupon = await Coupon.findOne({
		  code: promoCode.toUpperCase().trim(),
		  isActive: true
		});
		
		if (coupon && coupon.isValid()) {
		  // Get cart and verify minimum order amount
		  const cart = await Cart.findOne({ user: userId }).populate("items.product");
		  if (cart && cart.items.length > 0) {
			const cartTotal = calculateTotalAmount(cart.items);
			
			// Check if user has already used this coupon
			const user = await User.findById(userId);
			const canUseCoupon = !user.coupenUsed.includes(promoCode.toUpperCase().trim());
			
			// Check minimum order amount
			if (canUseCoupon && cartTotal >= coupon.minOrderAmount) {
			  // Create appliedCoupon object to pass to createOrder
			  appliedCoupon = {
				code: coupon.code,
				discountAmount: coupon.discountAmount,
				originalTotal: cartTotal,
				finalTotal: Math.max(0, cartTotal - coupon.discountAmount)
			  };
			}
		  }
		}
	  }
	  
	  const order = await createOrder(userId, {
		shippingAddress,
		paymentMethod,
		appliedCoupon
	  });
	  
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
		const order = await getOrderById(req.params.id);

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
		const orders = await getOrders(req.user._id, "ongoing");//req.user._id

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
		const orders = await getOrders(req.user._id, "completed");//req.user._id

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
