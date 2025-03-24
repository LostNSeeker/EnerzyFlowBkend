// File: backend/controllers/productController.js
import Product from "../../models/Product.js";

// @desc    Get all products
// @route   GET /admin/products
// @access  Private
export const getProducts = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter options
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.inStock !== undefined) {
      filter.inStock = req.query.inStock === "true";
    }

    // Search term
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filter.$or = [
        { name: searchRegex },
        { productId: searchRegex },
        { description: searchRegex },
      ];
    }

    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get product by ID
// @route   GET /admin/products/:id
// @access  Private
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a product
// @route   POST /admin/products
// @access  Private
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      variant,
      price,
      category,
      description,
      inStock,
      rating,
      totalReviews,
      lotSize,
      sizes,
      images,
    } = req.body;

    const product = await Product.create({
      name,
      variant,
      price,
      category,
      description,
      inStock,
      rating,
      totalReviews,
      lotSize,
      images,
      sizes,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a product
// @route   PUT /admin/products/:id
// @access  Private
export const updateProduct = async (req, res) => {
  try {
    const product_Id = req.params.id;
    const product = await Product.findById(product_Id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Define allowed fields for updating
    const allowedFields = [
      'name',
      'variant',
      'price',
      'category',
      'description',
      'inStock',
      'rating',
      'totalReviews',
      'lotSize',
      'sizes',
      'images',    ];
    
    // Extract only the allowed fields that are provided
    const updatedFields = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (value !== undefined && allowedFields.includes(key)) {
        updatedFields[key] = value;
      }
    }
    
    // Method 1: Using findByIdAndUpdate (recommended for partial updates)
    const updatedProduct = await Product.findByIdAndUpdate(
      product_Id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// @desc    Delete a product
// @route   DELETE /admin/products/:id
// @access  Private
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
