import { createPaymentOrder, processPayment } from '../../services/payment.service.js';
import { sendOrderConfirmation } from '../../services/notification.service.js';

export const initiatePayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const paymentOrder = await createPaymentOrder(amount, orderId);

    res.status(200).json({
      success: true,
      data: paymentOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Payment initiation failed'
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    const order = await processPayment(orderId, paymentId, signature);

    // Send confirmation
    await sendOrderConfirmation(
      req.user.phoneNumber,
      order._id,
      order.totalAmount
    );

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Payment verification failed'
    });
  }
};