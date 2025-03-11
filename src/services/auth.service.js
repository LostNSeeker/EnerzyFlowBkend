import User from "../models/User.js";
import OTP from "../models/OTP.js";
import { generateOTP, sendSMS } from "../utils/smsService.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { APP_CONSTANTS } from "../constants/app.constants.js";

export const loginService = async (phoneNumber, vendorId) => {
  // Log all users in the database
  console.log(phoneNumber, vendorId, "inside login service");

  const user = await User.findOne({ vendorId });

  if (!user) {
    console.log("User not found for vendorId:", vendorId);
    throw new Error("Invalid vendor ID");
  }
  // Check if an OTP was already generated in the last 3 minutes
  const recentOtp = await OTP.findOne({
    phoneNumber,
    createdAt: { $gt: new Date(Date.now() - 180000) }, // 180000 ms = 3 minutes
  });

  if (recentOtp) {
	console.log("OTP sent recently");
    return { success: true, message: "OTP sent recently" };
  }

  console.log("User found:", user);

  const otp = generateOTP();
  console.log("Generated OTP:", otp);
  console.log("assosiating OTP with phone number:", phoneNumber);
  await OTP.create({
    phoneNumber,
    otp: await bcrypt.hash(otp, 10),
  });
  console.log("funtion call to send otp:", phoneNumber);
  // const res=await sendSMS(phoneNumber, `Your OTP is: ${otp}`);
  console.log("otp sent successfully");
  return { success: true };
};

export const verifyOTPService = async (phoneNumber, otp) => {
  console.log("phoneNumber and otp in verify otp service:", phoneNumber, otp);
  console.log("inside verify otp service");
  const otps = await OTP.find({});
  console.log("All otp in database:", otps);
  const otpRecord = await OTP.findOne({ phoneNumber }).sort({ createdAt: -1 });
  console.log(
    "otprcord",
    otpRecord,
    "bcrypt",
    await bcrypt.compare(otp, otpRecord.otp)
  );
  if (!otpRecord || !(await bcrypt.compare(otp, otpRecord.otp))) {
    return { success: false, message: "Invalid OTP" };
  }
  console.log("finding user");
  const user = await User.findOne({ phoneNumber });
  console.log("got user:", user);
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  console.log("token", token);
  await OTP.deleteOne({ _id: otpRecord._id });
  console.log("deleted otp");
  return { token, user };
};

export const setupProfileService = async (userId, profileData) => {
  const user = await User.findByIdAndUpdate(userId, profileData, {
    new: true,
    runValidators: true,
  });
  return user;
};
