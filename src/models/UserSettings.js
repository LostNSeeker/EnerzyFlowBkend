import mongoose from 'mongoose';

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  pushNotifications: {
    type: Boolean,
    default: true
  },
  emailNotifications: {
    type: Boolean,
    default: false
  },
  darkMode: {
    type: Boolean,
    default: false
  },
  locationServices: {
    type: Boolean,
    default: true
  },
  biometricAuth: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create or update settings middleware
userSettingsSchema.statics.createOrUpdateSettings = async function(userId, settingsData) {
  try {
    const settings = await this.findOneAndUpdate(
      { userId },
      {
        ...settingsData,
        lastUpdated: Date.now()
      },
      {
        new: true, // Return the updated document
        upsert: true, // Create if doesn't exist
        runValidators: true // Run schema validators on update
      }
    );
    return settings;
  } catch (error) {
    console.error('Error in createOrUpdateSettings:', error);
    throw error;
  }
};

// Get settings by user ID
userSettingsSchema.statics.getSettingsByUserId = async function(userId) {
  try {
    const settings = await this.findOne({ userId });
    if (!settings) {
      return await this.create({ userId });
    }
    return settings;
  } catch (error) {
    console.error('Error in getSettingsByUserId:', error);
    throw error;
  }
};

const UserSettings = mongoose.model('UserSettings', userSettingsSchema);

export default UserSettings;