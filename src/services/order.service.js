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
export const getOrderById = async (id) => {
	try {

	  // Look up the order by _id (MongoDB ObjectId)
	  const order = await Order.findById(id)
		.populate('items.product', 'name price images category')
		.exec();
  
	  if (!order) {
		throw new Error(`Order with ID ${id} not found`);
	  }
  
	  return order;
	} catch (error) {
	  console.error(`Error in getOrderById: ${error.message}`);
	  throw error;
	}
  };
export const getOrders = async (userId, status) => {
	if (status==="ongoing") {
		return Order.find({ user: userId, orderStatus: { $nin: ["delivered", "cancelled"] } }).sort({ createdAt: -1 });
	}
	if (status==="completed") {
		return Order.find({ user: userId, orderStatus: "delivered" }).sort({ createdAt: -1 });
	}
	return Order.find({ user: userId }).sort({ createdAt: -1 });
};

export const updateOrderStatus = async (orderId, status) => {
	const order = await Order.findByIdAndUpdate(
		orderId,
		{ orderStatus: status },
	);
	return order;
};
