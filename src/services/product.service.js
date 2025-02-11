import { Product } from '../models/Product.js';

export const getAllProducts = async (query) => {
  const { category, search, sort, page = 1, limit = 10 } = query;
  
  let filter = {};
  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const sortOptions = {
    'price_asc': { price: 1 },
    'price_desc': { price: -1 },
    'rating_desc': { rating: -1 }
  };

  const products = await Product.find(filter)
    .sort(sortOptions[sort] || { createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Product.countDocuments(filter);
  
  return { products, total, pages: Math.ceil(total / limit) };
};

export const getProductDetails = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

export const getProductsByCategory = async (category) => {
  return Product.find({ category, inStock: true });
};