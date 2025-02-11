import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createPaymentOrder = async (amount, orderId) => {
  const options = {
    amount: amount * 100,
    currency: 'INR',
    receipt: orderId,
    payment_capture: 1
  };
  return await razorpay.orders.create(options);
};

export const verifyPaymentSignature = (orderId, paymentId, signature) => {
  const text = orderId + '|' + paymentId;
  const generated = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');
  return generated === signature;
};

export const processPayment = async (orderId, paymentId, signature) => {
  const isValid = verifyPaymentSignature(orderId, paymentId, signature);
  if (!isValid) {
    throw new Error('Invalid payment signature');
  }

  const order = await Order.findById(orderId);
  order.paymentStatus = 'completed';
  order.paymentId = paymentId;
  await order.save();

  return order;
};