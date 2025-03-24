import Coupon from '../../models/Coupon.js';

// Get all active Coupons
export const getActiveCoupons = async (req, res) => {
  try {
    const now = new Date();
    
    // Find all coupons first
    const allCoupons = await Coupon.find({
      isActive: true,
      startDate: { $lte: now },
      expiryDate: { $gte: now },
      $expr: { $lt: ["$usedCount", "$maxUses"] }
    });
    
    // Filter coupons using the isValid method
    const validCoupons = allCoupons.filter(coupon => coupon.$isValid());
    
    // Format Coupons for frontend display
    const formattedCoupons = validCoupons.map(coupon => ({
      id: coupon._id,
      code: coupon.code,
      discountAmount: coupon.discountAmount,
      description: getDescriptionForCoupon(coupon),
      minOrderAmount: coupon.minOrderAmount,
      subtext: getSubtextForCoupon(coupon),
      imageUrl: "../../assets/images/Banner1.png",
      expiryDate: coupon.expiryDate,
    }));
    
    return res.status(200).json({
      success: true,
      coupons: formattedCoupons
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching coupons',
      error: error.message
    });
  }
};

// Helper function to generate user-friendly descriptions
const getDescriptionForCoupon = (coupon) => {
  if (coupon.code.includes('FIRST') || coupon.code.includes('NEW')) {
    return 'Enjoy your first order';
  } else if (coupon.code.includes('LABEL') || coupon.code.includes('DESIGN')) {
    return 'On label design & logo charges!';
  } else {
    return `${coupon.discountAmount} Rs off on your order`;
  }
};

// Helper function to generate subtext
const getSubtextForCoupon = (coupon) => {
  if (coupon.minOrderAmount > 0) {
    return `Min. order: ₹${coupon.minOrderAmount}`;
  } else if (coupon.code === 'FIRST10') {
    return 'Start with just 50 packets!';
  } else {
    return `Use code: ${coupon.code}`;
  }
};

// Admin API to create a new Coupon
// export const createCoupon = async (req, res) => {
//   try {
//     const {
//       code,
//       discountAmount,
//       maxUses,
//       startDate,
//       expiryDate,
//       minOrderAmount,
//       isActive
//     } = req.body;
    
//     // Validate required fields
//     if (!code || !discountAmount || !expiryDate) {
//       return res.status(400).json({
//         success: false,
//         message: 'Code, discount amount, and expiry date are required'
//       });
//     }
    
//     // Check if Coupon code already exists
//     const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
//     if (existingCoupon) {
//       return res.status(400).json({
//         success: false,
//         message: 'Coupon code already exists'
//       });
//     }
    
//     // Create new Coupon
//     const newCoupon = new Coupon({
//       code: code.toUpperCase(),
//       discountAmount,
//       maxUses: maxUses || 100,
//       startDate: startDate || new Date(),
//       expiryDate,
//       minOrderAmount: minOrderAmount || 0,
//       isActive: isActive !== undefined ? isActive : true
//     });
    
//     await newCoupon.save();
    
//     return res.status(201).json({
//       success: true,
//       message: 'Coupon created successfully',
//       Coupon: newCoupon
//     });
//   } catch (error) {
//     console.error('Error creating Coupon:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Server error while creating Coupon',
//       error: error.message
//     });
//   }
// };