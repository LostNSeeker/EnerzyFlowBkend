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
  },
});

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;