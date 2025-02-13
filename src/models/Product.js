import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	variant: {
		type: String,
		trim: true,
	},
	price: {
		type: Number,
		required: true,
		min: 0,
	},
	images: [String],
	category: {
		type: String,
		enum: ["Customize Bottles", "General Purpose", "Special Offers"],
		required: true,
	},
	description: String,
	inStock: {
		type: Boolean,
		default: true,
	},
	rating: {
		type: Number,
		default: 0,
		min: 0,
		max: 5,
	},
	totalReviews: {
		type: Number,
		default: 0,
	},
	colors: [String],
	sizes: [String],
	customization: {
		available: {
			type: Boolean,
			default: false,
		},
		options: [
			{
				name: String,
				values: [String],
				priceImpact: Number,
			},
		],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Product = mongoose.model("Product", productSchema);

export default Product;
