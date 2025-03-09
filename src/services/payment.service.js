import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

function calculateTotalAmount(order) {
  const itemsTotal = order.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const discountAmount = order.discount || 0;
  const coinsUsedAmount = order.coinsUsed || 0;
  const totalAmount = itemsTotal - discountAmount - coinsUsedAmount;
  return parseFloat(totalAmount.toFixed(2));
}

export const createPaymentOrder = async (amount, orderId) => {
  const _id = orderId;

  const order = await Order.findById(_id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }
  const total = calculateTotalAmount(order);
  if (total !== amount) {
    return res.status(400).json({
      success: false,
      message: "Invalid total amount",
    });
  }
  const options = {
    amount: total * 100,
    currency: "INR",
    receipt: orderId,
    payment_capture: 1,
  };
  const response = await razorpay.orders.create(options);
  return response;
};

export const verifyPaymentSignature = (orderId, paymentId, signature) => {
  const text = orderId + "|" + paymentId;
  const generated = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest("hex");
  return generated === signature;
};

export const processPayment = async (orderId, paymentId, signature) => {
  const isValid = verifyPaymentSignature(orderId, paymentId, signature);
  if (!isValid) {
    throw new Error("Invalid payment signature");
  }

  const order = await Order.findById(orderId);
  order.paymentStatus = "completed";
  order.paymentId = paymentId;
  await order.save();

  return order;
};
