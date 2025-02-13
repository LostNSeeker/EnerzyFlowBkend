import { getProductsByCategory } from "../../services/product.service.js";

export const getCategoryProducts = async (req, res) => {
	try {
		const { category } = req.params;
		const products = await getProductsByCategory(category);

		res.status(200).json({
			success: true,
			data: products,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Failed to fetch category products",
		});
	}
};
