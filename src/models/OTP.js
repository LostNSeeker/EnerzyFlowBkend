import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Automatically delete documents after 300 seconds (5 minutes)
  },
});

// Create a compound index on phoneNumber and createdAt for efficient queries
otpSchema.index({ phoneNumber: 1, createdAt: -1 });

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;