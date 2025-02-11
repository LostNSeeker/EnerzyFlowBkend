import { setupProfileService } from '../../services/auth.service.js';
import { uploadImage } from '../../utils/imageUpload.js';

export const setupProfile = async (req, res) => {
  try {
    const {
      businessName,
      businessAddress,
      city,
      pinCode,
      state,
      kycType,
      otherKycName
    } = req.body;

    const profileData = {
      businessName,
      businessAddress,
      city,
      pinCode,
      state,
      kycType,
      ...(kycType === 'Others' && { otherKycName })
    };

    const user = await setupProfileService(req.user._id, profileData);

    res.status(200).json({
      success: true,
      message: 'Profile setup successful',
      user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Profile setup failed'
    });
  }
};