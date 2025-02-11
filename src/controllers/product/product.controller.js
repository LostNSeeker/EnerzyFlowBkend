import { getAllProducts, getProductDetails, getProductsByCategory } from '../../services/product.service.js';

export const getProducts = async (req, res) => {
  try {
    const { category, sort, page, limit } = req.query;
    const products = await getAllProducts({ category, sort, page, limit });

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch products'
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductDetails(id);

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'Product not found'
    });
  }
};