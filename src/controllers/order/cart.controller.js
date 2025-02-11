import { Cart } from '../../models/Cart.js';

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, customization } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity, customization }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].customization = customization;
      } else {
        cart.items.push({ product: productId, quantity, customization });
      }

      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to add to cart'
    });
  }
};