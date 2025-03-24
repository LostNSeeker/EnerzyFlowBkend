import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';


const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        default:uuidv4(),
        unique: true,
        trim: true
    },
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
    sizes: [String],
    lotSize: { // New field added here
        type: Number,
        default: 1, // Default value if not provided
        min: 1, // Minimum value allowed
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Add index for faster queries

const Product = mongoose.model("Product", productSchema);

export default Product;