import Cart from "../../models/Cart.js";

export const addToCart = async (req, res) => {
	try {
		const { productId, quantity } = req.body;

		let cart = await Cart.findOne({ user: "67cac2e3d43686869ff88f46" });//user : req.user._id

		if (!cart) {
			cart = await Cart.create({
				user: "67cac2e3d43686869ff88f46",//user : req.user._id
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
		const cart = await Cart.findOne({ user: "67cac2e3d43686869ff88f46" }).populate(//user : req.user._id
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
		const cart = await Cart.findOne({ user: "67cac2e3d43686869ff88f46" }).populate(//user : req.user._id
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

		const cart = await Cart.findOne({ user: "67cac2e3d43686869ff88f46" }).populate(//user : req.user._id
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

		const cart = await Cart.findOne({ user: req.user._id });

		if (!cart) {
			return res.status(400).json({
				success: false,
				message: "Cart not found",
			});
		}

		// Apply promo code logic here

		res.status(200).json({
			success: true,
			message: "Promo code applied",
			data: cart,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Failed to apply promo code",
		});
	}
};
