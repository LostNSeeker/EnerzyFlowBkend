import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import { createPaymentOrder } from "../utils/paymentUtils.js";

export const createOrder = async (userId, orderData) => {
	const cart = await Cart.findOne({ user: userId }).populate("items.product");
	if (!cart || cart.items.length === 0) {
		throw new Error("Cart is empty");
	}

	const order = new Order({
		user: userId,
		items: cart.items.map((item) => ({
			product: item.product._id,
			quantity: item.quantity,
			price: item.product.price,
			customization: item.customization,
		})),
		totalAmount: orderData.totalAmount,
		shippingAddress: orderData.shippingAddress,
		paymentMethod: orderData.paymentMethod,
	});

	if (orderData.paymentMethod === "googlepay") {
		const paymentOrder = await createPaymentOrder(order.totalAmount, order._id);
		order.razorpayOrderId = paymentOrder.id;
	}

	await order.save();
	await Cart.findOneAndDelete({ user: userId });

	return order;
};

export const getOrders = async (userId, status) => {
	const query = { user: userId };
	if (status) query.orderStatus = status;
	return Order.find(query).sort({ createdAt: -1 });
};

export const updateOrderStatus = async (orderId, status) => {
	const order = await Order.findByIdAndUpdate(
		orderId,
		{ orderStatus: status },
		{ new: true }
	);
	return order;
};
