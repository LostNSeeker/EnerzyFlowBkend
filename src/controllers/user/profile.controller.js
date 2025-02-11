import { User } from '../../models/User.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-__v');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch profile'
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { businessName, businessAddress, city, state, pinCode } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        businessName,
        businessAddress,
        city,
        state,
        pinCode
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
};