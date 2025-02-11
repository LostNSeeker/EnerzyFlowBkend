import { loginService, verifyOTPService } from '../../services/auth.service.js';
import { validatePhoneNumber } from '../../utils/validators.js';

export const login = async (req, res) => {
  try {
    const { phoneNumber, vendorId } = req.body;

    if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    await loginService(phoneNumber, vendorId);
    
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      phoneNumber
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};