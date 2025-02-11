import { Product } from '../../models/Product.js';
import { Review } from '../../models/Review.js';

export const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      comment
    });

    // Update product rating
    const product = await Product.findById(productId);
    const reviews = await Review.find({ product: productId });
    
    const averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    
    product.rating = averageRating;
    product.totalReviews = reviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to add review'
    });
  }
};