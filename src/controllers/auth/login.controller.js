import { loginService, verifyOTPService } from "../../services/auth.service.js";
import { validatePhoneNumber } from "../../utils/validators.js";
import User from "../../models/User.js";
import {
  generateVendorId,
  generateUniqueReferralCode,
} from "../../utils/user_profile_utils.js";
import fs from "fs";
import { saveFile } from "../../middleware/upload.js";

export const login = async (req, res) => {
  try {
    console.log(req.body);
    const { phoneNumber, vendorId } = req.body;
    console.log("passing through validation");
    if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      });
    }
    console.log("validation passed");
    // console.log(req.body)
    await loginService(phoneNumber, vendorId);
    console.log("done");
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      phoneNumber,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
      });
    }

    const { token, user,success,message } = await verifyOTPService(phoneNumber, otp);

    res.status(200).json({
      success: success,
      message: message,
      token,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "OTP verification failed",
    });
  }
};

export const setupProfile = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      businessName,
      businessType,
      businessAddress,
      city,
      pinCode,
      state,
      kycDocName,
      referralCode,
      image,
    } = req.body;

    const documentData = await saveFile(image);
    if (!documentData) {
      return res.status(400).json({
        success: false,
        message: "KYC document saving error",
      });
    }

    // Check if user already exists with this phone number
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Profile already set up for this phone number",
      });
    }

    console.log("documentData", documentData);
    // Generate a unique vendor ID
    const vendorId = generateVendorId();

    // Generate a unique referral code for the user
    const userReferralCode = generateUniqueReferralCode(name);

    // Create new user
    const newUser = new User({
      Name: name,
      phoneNumber,
      vendorId,
      businessName,
      businessType,
      businessAddress,
      city,
      pinCode,
      state,
      kycStatus: "kyc_pending",
      kycDocument: documentData,
      referralCode: userReferralCode,
    });
    console.log("newUser", newUser);
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        newUser.referredBy = referrer._id;
        // Award 100 coins to both the referrer and the referred user
        newUser.refralWalletAmount += 100;
        referrer.refralWalletAmount += 100;
        // Add the new user to the referrer's referredTo list
        referrer.referredTo.push(newUser._id);
        // Increment the referral count for the referrer
        referrer.referralCount += 1;
        await referrer.save();
        console.log("Referral reward added: 100 coins to both users");
      }
    }

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      user: {
        name: newUser.Name,
        phoneNumber: newUser.phoneNumber,
        vendorId: newUser.vendorId,
        businessName: newUser.businessName,
        kycStatus: newUser.kycStatus,
      },
    });
  } catch (error) {
    console.error("Profile setup error:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while setting up profile",
      error: error.message,
    });
  }
};
