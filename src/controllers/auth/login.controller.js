import { loginService, verifyOTPService } from "../../services/auth.service.js";
import { validatePhoneNumber } from "../../utils/validators.js";

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

    const { token, user } = await verifyOTPService(phoneNumber, otp);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
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

import User from "../../models/User.js";
import {
  generateVendorId,
  generateUniqueReferralCode,
} from "../../utils/user_profile_utils.js";
import fs from "fs";

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
      document,
    } = req.body;

    console.log("body", req.body);
    console.log(
      "two funtioin calling",
      generateVendorId(),
      generateUniqueReferralCode(name)
    );

    // Check if file was uploaded
    // if (!req.file) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "KYC document is required",
    //   });
    // }

    // Check if user already exists with this phone number
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      // Delete the uploaded file if user already has profile
      fs.unlinkSync(req.file.path);

      return res.status(400).json({
        success: false,
        message: "Profile already set up for this phone number",
      });
    }

    // // Prepare document data from the uploaded file
    // const documentData = {
    //   uri: req.file.path, // Path to the saved file
    //   name: kycDocName || req.file.originalname,
    //   mimeType: req.file.mimetype,
    //   size: req.file.size,
    // };

    // Generate a unique vendor ID
    const vendorId = generateVendorId();

    // Generate a unique referral code for the user
    const userReferralCode = generateUniqueReferralCode(name);

    // Create or update user
    if (existingUser) {
      // Update existing user
      existingUser.Name = name;
      existingUser.businessName = businessName;
      existingUser.businessType = businessType;
      existingUser.businessAddress = businessAddress;
      existingUser.city = city;
      existingUser.pinCode = pinCode;
      existingUser.state = state;
      existingUser.kycStatus = "kyc_pending";
      // existingUser.kycDocument = documentData; // Add document data
      existingUser.referralCode = userReferralCode;

      // Check if there's a valid referral code
      if (referralCode) {
        const referrer = await User.findOne({ referralCode });
        if (referrer) {
          existingUser.referredBy = referrer._id;
          // Award coins to the referrer here if needed
          console.log("refral award here, logic not implemented");
        }
      }

      await existingUser.save();

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: {
          name: existingUser.Name,
          phoneNumber: existingUser.phoneNumber,
          vendorId: existingUser.vendorId,
          businessName: existingUser.businessName,
          kycStatus: existingUser.kycStatus,
        },
      });
    } else {
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
        // kycDocument: documentData, // Add document data
        referralCode: userReferralCode,
      });

      // Check if there's a valid referral code
      if (referralCode) {
        const referrer = await User.findOne({ referralCode });
        if (referrer) {
          newUser.referredBy = referrer._id;
          // Award coins to the referrer here if needed
          console.log("refral award here, logic not implemented");
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
    }
  } catch (error) {
    console.error("Profile setup error:", error);

    // Clean up the file if there was an error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred while setting up profile",
      error: error.message,
    });
  }
};

export const uploadKYC = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "KYC document is required",
      });
    }

    req.user.kyc = req.file.filename;
    await req.user.save();

    res.status(200).json({
      success: true,
      message: "KYC document uploaded successfully",
      user: req.user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "KYC upload failed",
    });
  }
};
