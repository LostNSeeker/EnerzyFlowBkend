// models/Coupon.js
import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discountAmount: {
    type: Number,
    required: true,
    min: 1  // Minimum discount of 1 rupee
  },
  isActive: {
    type: Boolean,
    default: true
  },
  maxUses: {
    type: Number,
    default: 1  // How many times this coupon can be used in total
  },
  usedCount: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  minOrderAmount: {
    type: Number,
    default: 0  // Minimum order value to apply this coupon
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true  // Once set, cannot be changed
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Pre-save middleware to ensure expiryDate is after startDate
couponSchema.pre('save', function(next) {
  if (this.expiryDate <= this.startDate) {
    return next(new Error('Expiry date must be after start date'));
  }
  next();
});

// Method to check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  return (
    this.isActive && 
    this.usedCount < this.maxUses && 
    now >= this.startDate && 
    now <= this.expiryDate
  );
};

// Method to check if coupon can be applied to an order
couponSchema.methods.isApplicable = function(orderAmount) {
  return orderAmount >= this.minOrderAmount && this.isValid();
};

// Method to use the coupon
couponSchema.methods.use = function() {
  if (!this.isValid()) {
    throw new Error('Coupon is not valid');
  }
  
  this.usedCount += 1;
  if (this.usedCount >= this.maxUses) {
    this.isActive = false;
  }
  
  return this.save();
};

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;


// const newCoupon = new Coupon({
//     code: 'WELCOME20',
//     discountAmount: 250,
//     maxUses: 100,
//     expiryDate: new Date('2025-12-31')
//   });
  
//   await newCoupon.save();