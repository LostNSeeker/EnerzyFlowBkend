import Cart from "../../models/Cart.js";
import Coupon from "../../models/Coupon.js";
import User from "../../models/User.js";
import { calculateTotalAmount } from "../../services/order.service.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to add to cart",
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate(
      //user : req.user._id
      "items.product"
    );

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to get cart",
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate(
      //user : req.user._id
      "items.product"
    );
    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product._id.toString() !== id
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to remove from cart",
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { id } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate(
      //user : req.user._id
      "items.product"
    );
    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product._id.toString() === id
    );

    if (itemIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart item updated",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update cart item",
    });
  }
};

export const applyPromoCode = async (req, res) => {
  try {
    const { promoCode } = req.body;
    const userId = req.user._id;
    console.log("user and promo code", userId, promoCode);
    // Find the user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty or not found",
      });
    }
    console.log("console log cart", cart);
    // Find the coupon
    const coupons = await Coupon.find({});
	console.log("all coupend her coupen",coupons);
    const coupon = await Coupon.findOne({
      code: promoCode.toUpperCase().trim(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }
    console.log("coupen", coupon);
    // Check if coupon is valid (using the model method)
    if (!coupon.isValid()) {
      return res.status(400).json({
        success: false,
        message: "Coupon has expired or reached maximum usage limit",
      });
    }

    // Check if user has already used this coupon
    const user = await User.findById(userId);
    if (user.coupenUsed.includes(promoCode.toUpperCase().trim())) {
      return res.status(400).json({
        success: false,
        message: "You have already used this coupon",
      });
    }
    console.log("user", user);
    // Calculate cart total
    let cartTotal = calculateTotalAmount(cart.items);

    // Check minimum order amount
    if (cartTotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required to apply this coupon`,
      });
    }

    // Calculate discounted amount
    const discountAmount = coupon.discountAmount;
    const finalAmount = Math.max(0, cartTotal - discountAmount);
    console.log("dis and final", discountAmount, finalAmount);
    // Store coupon info in the session for order creation
    req.session = req.session || {};
    req.session.appliedCoupon = {
      code: coupon.code,
      discountAmount: discountAmount,
      originalTotal: cartTotal,
      finalTotal: finalAmount,
    };

    res.status(200).json({
      success: true,
      message: "Promo code applied successfully",
      data: {
        originalTotal: cartTotal,
        discountAmount: discountAmount,
        finalTotal: finalAmount,
        couponCode: coupon.code,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to apply promo code",
    });
  }
};
