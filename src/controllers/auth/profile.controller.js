import { setupProfileService } from '../../services/auth.service.js';
import { uploadDocument } from '../../utils/documentUpload.js';
import { validatePhoneNumber, validatePinCode } from '../../utils/validators.js';

export const setupProfile = async (req, res) => {
  try {
    const {
      name,
      phoneNo,
      userName, // businessName in backend
      businessType,
      streetAddress, // businessAddress in backend
      city,
      pinCode,
      state,
      kycDocName,
      referralCode
    } = req.body;

    // Validate phone number format
    if (!validatePhoneNumber(phoneNo)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format"
      });
    }

    // Validate PIN code
    if (!validatePinCode(pinCode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid PIN code format"
      });
    }

    // Check for required document upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "KYC document is required"
      });
    }

    // Process document upload
    const documentData = {
      uri: req.file.path,
      name: kycDocName,
      mimeType: req.file.mimetype,
      size: req.file.size
    };

    // Prepare profile data
    const profileData = {
      Name: name,
      phoneNumber: phoneNo, // This will be the unique identifier
      businessName: userName,
      businessType,
      businessAddress: streetAddress,
      city,
      pinCode,
      state,
      kycDocument: documentData,
      referralCode
    };

    const user = await setupProfileService(phoneNo, profileData);

    res.status(200).json({
      success: true,
      message: 'Profile setup successful',
      user
    });
  } catch (error) {
    // Handle specific error cases
    if (error.code === 11000) { // MongoDB duplicate key error
      return res.status(400).json({
        success: false,
        message: 'Phone number already registered'
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Profile setup failed'
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      businessName,
      businessType,
      businessAddress,
      city,
      pinCode,
      state
    } = req.body;

    // Validate PIN code if provided
    if (pinCode && !validatePinCode(pinCode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid PIN code format"
      });
    }

    const updateData = {
      businessName,
      businessType,
      businessAddress,
      city,
      pinCode,
      state
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const user = await User.findOneAndUpdate(
      { phoneNumber: req.user.phoneNumber },
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Profile update failed'
    });
  }
};

export const updateKYC = async (req, res) => {
  try {
    const { kycDocName } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "KYC document is required"
      });
    }

    const documentData = {
      uri: req.file.path,
      name: kycDocName || req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size
    };

    const user = await User.findOneAndUpdate(
      { phoneNumber: req.user.phoneNumber },
      { 
        kycDocument: documentData,
        kycStatus: 'pending' // Reset KYC status on new document upload
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'KYC document updated successfully',
      user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'KYC update failed'
    });
  }
};