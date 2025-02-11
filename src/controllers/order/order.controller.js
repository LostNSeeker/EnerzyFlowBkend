import { createOrder, getOrders, updateOrderStatus } from '../../services/order.service.js';
import { sendOrderConfirmation } from '../../services/notification.service.js';

export const createNewOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    
    const order = await createOrder(req.user._id, {
      shippingAddress,
      paymentMethod
    });

    // Send order confirmation
    await sendOrderConfirmation(
      req.user.phoneNumber,
      order._id,
      order.totalAmount
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const orders = await getOrders(req.user._id, status);

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch orders'
    });
  }
};