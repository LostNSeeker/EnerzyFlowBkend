import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  vendorId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  businessName: {
    type: String,
    trim: true,
  },
  businessAddress: {
    type: String,
    trim: true,
  },
  businessType: {
    type: String,
    trim: true,
  },
  city: String,
  pinCode: String,
  state: String,

  kycStatus: {
    type: String,
    enum: ["kyc_pending", "verified", "rejected"],
    default: "pending",
  },

  kycDocument: {
    uri: { type: String },  // URL of the uploaded document
    name: { type: String},//doc name
    mimeType: { type: String}, // File type (image/pdf)
    size: { type: Number},  // File size in bytes
  },

  coins: {
    type: Number,
    default: 2500,
  },

  referralCode: {
    type: String,
    unique: true,
  },

  referredBy: {
    type: String,
  },
  refralWalletAmount: {
    type: Number,
    default: 0,
  },
  referralCount: {
    type: Number,
    default: 0,
  },
  referredTo: {
    type: [{ type: String }],
    default: [],
  },
  coupenUsed: {
    type: [{ type: String }],
    default: [],
  },
  
  isActive: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  orders: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    default: [],  // Ensuring orders array is always initialized as empty
  },
});

const User = mongoose.model("User", userSchema);

export default User;