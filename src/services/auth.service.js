import { User } from '../models/User.js';
import { OTP } from '../models/OTP.js';
import { generateOTP, sendSMS } from '../utils/smsService.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const loginService = async (phoneNumber, vendorId) => {
  const user = await User.findOne({ vendorId });
  if (!user) {
    throw new Error('Invalid vendor ID');
  }

  const otp = generateOTP();
  await OTP.create({
    phoneNumber,
    otp: await bcrypt.hash(otp, 10)
  });

  await sendSMS(phoneNumber, `Your OTP is: ${otp}`);
  return { success: true };
};

export const verifyOTPService = async (phoneNumber, otp) => {
  const otpRecord = await OTP.findOne({ 
    phoneNumber,
    createdAt: { $gt: new Date(Date.now() - 300000) }
  });

  if (!otpRecord || !await bcrypt.compare(otp, otpRecord.otp)) {
    throw new Error('Invalid OTP');
  }

  const user = await User.findOne({ phoneNumber });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  await OTP.deleteOne({ _id: otpRecord._id });
  return { token, user };
};

export const setupProfileService = async (userId, profileData) => {
  const user = await User.findByIdAndUpdate(
    userId,
    profileData,
    { new: true, runValidators: true }
  );
  return user;
};
