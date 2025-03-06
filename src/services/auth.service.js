import User from "../models/User.js";
import OTP from "../models/OTP.js";
import { generateOTP, sendSMS } from "../utils/smsService.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { APP_CONSTANTS } from "../constants/app.constants.js";
export const loginService = async (phoneNumber, vendorId) => {
	// Log all users in the database
	// const allUsers = await User.find({});
	// console.log("All users in database:", allUsers);
	
	const user = await User.findOne({ vendorId });
	
	if (!user) {
	  console.log("User not found for vendorId:", vendorId);
	  throw new Error("Invalid vendor ID");
	}
	
	console.log("User found:", user);
	
	const otp = generateOTP();
	console.log("Generated OTP:", otp);
	console.log("assosiating OTP with phone number:", phoneNumber);
	await OTP.create({
	  phoneNumber,
	  otp: await bcrypt.hash(otp, 10),
	});
	console.log("sending OTP to:", phoneNumber);
	await sendSMS(phoneNumber, `Your OTP is: ${otp}`);
	console.log("otp sent successfully");
	return { success: true };
  };

export const verifyOTPService = async (phoneNumber, otp) => {
	const otpRecord = await OTP.findOne({
		phoneNumber,
		createdAt: { $gt: new Date(Date.now() - 300000) },
	});

	if (!otpRecord || !(await bcrypt.compare(otp, otpRecord.otp))) {
		throw new Error("Invalid OTP");
	}

	const user = await User.findOne({ phoneNumber });
	const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

	await OTP.deleteOne({ _id: otpRecord._id });
	return { token, user };
};

export const setupProfileService = async (userId, profileData) => {
	const user = await User.findByIdAndUpdate(userId, profileData, {
		new: true,
		runValidators: true,
	});
	return user;
};
