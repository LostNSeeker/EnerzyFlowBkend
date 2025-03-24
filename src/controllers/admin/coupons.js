// File: backend/controllers/couponController.js
import Coupon from "../../models/Coupon.js";
import User from "../../models/User.js";
import Product from "../../models/Product.js";
import Order from "../../models/Order.js";
// @desc    Get all coupons
// @route   GET /admin/coupons
// @access  Private
export const getCoupons = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter options
    const filter = {};
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === "true";
    }

    // Filter for active and non-expired coupons
    if (req.query.valid === "true") {
      filter.isActive = true;
      filter.expiryDate = { $gte: new Date() };
      filter.usedCount = { $lt: { $ref: "maxUses" } };
    }

    // Search term
    if (req.query.search) {
      filter.code = new RegExp(req.query.search, "i");
    }

    const coupons = await Coupon.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Coupon.countDocuments(filter);

    res.status(200).json({
      coupons,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Get coupons error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get coupon by ID
// @route   GET /admin/coupons/:id
// @access  Private
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json(coupon);
  } catch (error) {
    console.error("Get coupon by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a coupon
// @route   POST /admin/coupons
// @access  Private
export const createCoupon = async (req, res) => {
  try {
    let {
      code,
      discountAmount,
      isActive,
      maxUses,
      startDate,
      expiryDate,
      minOrderAmount,
      createdAt,
    } = req.body;
    console.log("body in create", req.body);
    // Check if coupon code is already used
    const codeExists = await Coupon.findOne({
      code: code.toUpperCase(),
    });
    if (codeExists) {
      return res.status(400).json({ message: "Coupon code already in use" });
    }

    // Ensure coupon code is uppercase
    code = code.toUpperCase();

    const coupon = await Coupon.create({
      code,
      discountAmount,
      isActive,
      maxUses,
      startDate,
      expiryDate,
      minOrderAmount,
      createdAt,
    });

    res.status(201).json(coupon);
  } catch (error) {
    console.error("Create coupon error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a coupon
// @route   PUT /admin/coupons/:id
// @access  Private
export const updateCoupon = async (req, res) => {
  try {
    console.log("body in update", req.body);
    const {
      _id,
      code,
      discountAmount,
      isActive,
      maxUses,
      startDate,
      expiryDate,
      minOrderAmount,
    } = req.body;

    const coupon = await Coupon.findById(_id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // Prepare update object with only provided fields
    const updateFields = {};

    // Handle code (with uppercase conversion) if provided
    if (code !== undefined) {
      const upperCode = code.toUpperCase();
      
      // Check if code is being changed and if it's already in use
      if (upperCode !== coupon.code) {
        const codeExists = await Coupon.findOne({
          code: upperCode,
          _id: { $ne: _id }
        });
        
        if (codeExists) {
          return res.status(400).json({ message: "Coupon code already in use" });
        }
      }
      
      updateFields.code = upperCode;
    }

    // Add other fields if they are provided
    if (discountAmount !== undefined) updateFields.discountAmount = discountAmount;
    if (isActive !== undefined) updateFields.isActive = isActive;
    if (maxUses !== undefined) updateFields.maxUses = maxUses;
    if (minOrderAmount !== undefined) updateFields.minOrderAmount = minOrderAmount;
    
    // Handle date validation
    const startDateObj = startDate ? new Date(startDate) : coupon.startDate;
    const expiryDateObj = expiryDate ? new Date(expiryDate) : coupon.expiryDate;
    
    if (expiryDateObj <= startDateObj) {
      return res.status(400).json({ message: "Expiry date must be after start date" });
    }
    
    if (startDate) updateFields.startDate = startDateObj;
    if (expiryDate) updateFields.expiryDate = expiryDateObj;
    
    // Always update the updatedAt timestamp
    updateFields.updatedAt = new Date();

    // Update using findByIdAndUpdate
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      _id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedCoupon);
  } catch (error) {
    console.error("Update coupon error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a coupon
// @route   DELETE /admin/coupons/:id
// @access  Private
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.deleteOne({ _id: req.params.id });
    if (coupon.deletedCount === 0) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Delete coupon error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// File: backend/controllers/dashboardController.js

// @desc    Get dashboard statistics
// @route   GET /admin/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    // Count total users, products, orders, and active coupons
    const userCount = await User.countDocuments({ isActive: true });
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const couponCount = await Coupon.countDocuments({
      isActive: true,
      expiryDate: { $gte: new Date() },
    });

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name phoneNumber")
      .populate("items.product", "name");

    // Calculate revenue
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Revenue today
    const todayRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday },
          orderStatus: { $nin: ["cancelled", "failed"] },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Revenue this week
    const weekRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek },
          orderStatus: { $nin: ["cancelled", "failed"] },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Revenue this month
    const monthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          orderStatus: { $nin: ["cancelled", "failed"] },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Total revenue
    const totalRevenue = await Order.aggregate([
      {
        $match: {
          orderStatus: { $nin: ["cancelled", "failed"] },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Monthly sales data for chart
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: oneYearAgo },
          orderStatus: { $nin: ["cancelled", "failed"] },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          sales: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Format monthly sales data
    const salesData = monthlySales.map((item) => {
      const date = new Date(item._id.year, item._id.month - 1, 1);
      return {
        name:
          date.toLocaleString("default", { month: "short" }) +
          " " +
          item._id.year,
        sales: item.sales,
      };
    });

    res.status(200).json({
      userCount,
      productCount,
      orderCount,
      couponCount,
      recentOrders,
      salesData,
      revenue: {
        today: todayRevenue.length > 0 ? todayRevenue[0].totalRevenue : 0,
        thisWeek: weekRevenue.length > 0 ? weekRevenue[0].totalRevenue : 0,
        thisMonth: monthRevenue.length > 0 ? monthRevenue[0].totalRevenue : 0,
        total: totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
