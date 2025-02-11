export const verifyOTP = async (req, res) => {
    try {
      const { phoneNumber, otp } = req.body;
  
      const { token, user } = await verifyOTPService(phoneNumber, otp);
  
      res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        token,
        user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || 'OTP verification failed'
      });
    }
  };