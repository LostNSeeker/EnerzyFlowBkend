// File: backend/controllers/dashboardController.js
import User from '../../models/User.js';
import Product from '../../models/Product.js';
import Order from '../../models/Order.js';
import Coupon from '../../models/Coupon.js';

// @desc    Get dashboard statistics
// @route   GET /admin/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    // Count total users, products, orders, and active coupons
    const userCount = await User.countDocuments({ isActive: true });
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const couponCount = await Coupon.countDocuments({ isActive: true, expiryDate: { $gte: new Date() } });
    
    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name phoneNumber')
      .populate('items.product', 'name');
    
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
          orderStatus: { $nin: ['cancelled', 'failed'] },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    // Revenue this week
    const weekRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek },
          orderStatus: { $nin: ['cancelled', 'failed'] },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    // Revenue this month
    const monthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          orderStatus: { $nin: ['cancelled', 'failed'] },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    // Total revenue
    const totalRevenue = await Order.aggregate([
      {
        $match: {
          orderStatus: { $nin: ['cancelled', 'failed'] },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    // Monthly sales data for chart
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: oneYearAgo },
          orderStatus: { $nin: ['cancelled', 'failed'] },
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          sales: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
    
    // Format monthly sales data
    const salesData = monthlySales.map(item => {
      const date = new Date(item._id.year, item._id.month - 1, 1);
      return {
        name: date.toLocaleString('default', { month: 'short' }) + ' ' + item._id.year,
        sales: item.sales
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
        total: totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0
      }
    });
    
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};