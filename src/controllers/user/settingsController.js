import mongoose from 'mongoose';
import UserSettings from '../../models/UserSettings.js';

export const getUserSettings = async (req, res) => {
  try {
    const { userId } = req.user || { userId: "60d21b4667d0d8992e610c85" }; // Ideally get from auth middleware
    
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    
    // Get settings for the user
    const settings = await UserSettings.getSettingsByUserId(userId);
    
    return res.status(200).json({
      success: true,
      data: { settings }
    });
  } catch (error) {
    console.error('Error in getUserSettings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user settings',
      error: error.message
    });
  }
};

export const updateUserSettings = async (req, res) => {
  try {
    const { userId } = req.user || { userId: "60d21b4667d0d8992e610c85" }; // Ideally get from auth middleware
    const updatedSettings = req.body;
    
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    
    // Validate settings updates
    const allowedSettings = [
      'pushNotifications',
      'emailNotifications',
      'darkMode',
      'locationServices',
      'biometricAuth'
    ];
    
    // Filter out any fields that are not in the allowed list
    const filteredSettings = Object.keys(updatedSettings)
      .filter(key => allowedSettings.includes(key))
      .reduce((obj, key) => {
        // Ensure all values are boolean
        obj[key] = Boolean(updatedSettings[key]);
        return obj;
      }, {});
    
    // Update settings
    const settings = await UserSettings.createOrUpdateSettings(userId, filteredSettings);
    
    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: { settings }
    });
  } catch (error) {
    console.error('Error in updateUserSettings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user settings',
      error: error.message
    });
  }
};