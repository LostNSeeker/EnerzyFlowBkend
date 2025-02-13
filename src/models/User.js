import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  vendorId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  businessName: {
    type: String,
    trim: true
  },
  businessAddress: {
    type: String,
    trim: true
  },
  businessType: {
    type: String,
    enum: ['Resturant', 'Bar', 'Others']
  },
  city: String,
  pinCode: String,
  state: String,
  kycType: {
    type: String,
    enum: ['Trade License', 'MSME', 'GST', 'Others']
  },
  otherKycName: String,
  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  kycDocument: String, // URL to uploaded document
  coins: {
    type: Number,
    default: 2500
  },
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});