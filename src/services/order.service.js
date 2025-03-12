import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import { createPaymentOrder } from "../utils/paymentUtils.js";
import Coupon from "../models/Coupern.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const calculateTotalAmount = (items) => {
  return items.reduce((total, item) => {
    if (
      item.product &&
      typeof item.product === "object" &&
      item.product.price
    ) {
      return total + item.quantity * item.product.price;
    }
    return total;
  }, 0);
};

const calculateTotalAmountWithPromo = (cartItems, appliedPromo = null) => {
  // Calculate original subtotal
  const subtotal = calculateTotalAmount(cartItems);

  if (appliedPromo) {
    return Math.max(0, subtotal - appliedPromo.discountAmount);
  }

  return subtotal;
};

export const createOrder = async (userId, orderData) => {
  // Start a transaction
  console.log("Inside createOrder with userId and orderData", userId, orderData);
  const session = await mongoose.startSession();
  console.log("Session started");
  session.startTransaction();
  
  try {
    const cart = await Cart.findOne({ user: userId })
      .populate("items.product")
      .session(session);
      
    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }
    console.log("Cart here", cart);
    
    // Check for applied promo code
    let appliedPromo = null;
    let discount = 0;
    
    // Get the promo code from orderData.appliedCoupon (passed from createNewOrder)
    if (orderData.appliedCoupon) {
      console.log("Coupon found in orderData", orderData.appliedCoupon);
      const { code } = orderData.appliedCoupon;
      
      // Verify coupon is valid
      const coupon = await Coupon.findOne({ code }).session(session);
      if (coupon && coupon.isValid()) {
        // Check if user has already used this coupon
        const user = await User.findById(userId).session(session);
        if (!user.coupenUsed.includes(code)) {
          // Calculate cart total to confirm minimum order amount
          const subtotal = calculateTotalAmount(cart.items);
          if (subtotal >= coupon.minOrderAmount) {
            // Mark coupon as used for this user
            await User.findByIdAndUpdate(
              userId,
              { $push: { coupenUsed: code } },
              { session }
            );
            
            // Increase the coupon usage count
            await Coupon.findByIdAndUpdate(
              coupon._id,
              { $inc: { usedCount: 1 } },
              { session }
            );
            
            // If usedCount reaches maxUses, deactivate the coupon
            if (coupon.usedCount + 1 >= coupon.maxUses) {
              await Coupon.findByIdAndUpdate(
                coupon._id,
                { isActive: false },
                { session }
              );
            }
            
            appliedPromo = coupon;
            discount = coupon.discountAmount;
          }
        }
      }
    }
    
    console.log("Calculating total amount", cart.items, appliedPromo);
    // Calculate total amount with potential discount
    const totalAmount = calculateTotalAmountWithPromo(cart.items, appliedPromo);
    console.log("Creating order", totalAmount);
    
    // Create order object
    const order = new Order({
      user: userId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
        customization: item.customization,
      })),
      totalAmount: totalAmount,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      // Add promo code details if applied
      appliedPromoCode: appliedPromo ? appliedPromo.code : undefined,
      discount: discount,
    });
    
    // Save order and clear cart
    await order.save({ session });
    await Cart.findOneAndDelete({ user: userId }, { session });
    console.log("Order created and cart deleted");
    
    // Commit transaction
    await session.commitTransaction();
    session.endSession();
    return order;
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();
    console.error(`Error in createOrder catch: ${error.message}`);
    throw error; // Re-throw to be caught by the controller
  }
};

export const getOrderById = async (id) => {
  try {
    const order = await Order.findById(id)
      .populate("items.product", "name price images category")
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
  if (status === "ongoing") {
    return Order.find({
      user: userId,
      orderStatus: { $nin: ["delivered", "cancelled"] },
    }).sort({ createdAt: -1 });
  }
  if (status === "completed") {
    return Order.find({ user: userId, orderStatus: "delivered" }).sort({
      createdAt: -1,
    });
  }
  return Order.find({ user: userId }).sort({ createdAt: -1 });
};

export const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findByIdAndUpdate(orderId, { orderStatus: status });
  return order;
};
