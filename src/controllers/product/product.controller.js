import Product from "../../models/Product.js";
import Review from "../../models/Review.js";
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
		console.log("inside searchProducts");
		console.log(req.body);
		console.log(req.query);
		console.log(req.params);
		const { search } = req.query;
		// const products = await searchProducts(search);//searchProducts is not defined
		const products ="search functionality currently not available";
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
	  const { rating, comment } = req.body;
	  const userId = req.user._id;

	  const newReview = await Review.create({
		product: id,
		user: userId,
		rating,
		comment
	  });
	  
	  res.status(201).json({
		success: true,
		data: newReview
	  });
	} catch (error) {
	  res.status(400).json({
		success: false,
		message: error.message || "Failed to add review"
	  });
	}
  };