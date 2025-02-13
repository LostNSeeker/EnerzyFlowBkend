import {
	getAllProducts,
	getProductDetails,
	getProductsByCategory,
} from "../../services/product.service.js";

export const getProducts = async (req, res) => {
	try {
		const { category, sort, page, limit } = req.query;
		const products = await getAllProducts({ category, sort, page, limit });

		res.status(200).json({
			success: true,
			data: products,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Failed to fetch products",
		});
	}
};

export const getProductById = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await getProductDetails(id);

		res.status(200).json({
			success: true,
			data: product,
		});
	} catch (error) {
		res.status(404).json({
			success: false,
			message: error.message || "Product not found",
		});
	}
};

export const getProductsDetailsByCategory = async (req, res) => {
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
			message: error.message || "Failed to fetch products",
		});
	}
};

export const searchProducts = async (req, res) => {
	try {
		const { search } = req.query;
		const products = await searchProducts(search);

		res.status(200).json({
			success: true,
			data: products,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Failed to search products",
		});
	}
};

export const addReview = async (req, res) => {
	try {
		const { id } = req.params;
		const { rating, review } = req.body;
		const product = await addReview(id, rating, review);

		res.status(200).json({
			success: true,
			data: product,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Failed to add review",
		});
	}
};
