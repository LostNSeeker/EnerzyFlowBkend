import mongoose from 'mongoose';
import UserSettings from "../models/UserSettings.js"; // Adjust the path as needed

async function createDummySettings(userId) {

  // Convert string userId to ObjectId if needed
  const userObjectId = typeof userId === 'string' 
    ? new mongoose.Types.ObjectId(userId) 
    : userId;
  
  // Create default settings with some randomization
  const defaultSettings = {
    userId: userObjectId,
    pushNotifications: Math.random() > 0.3, // 70% chance of being true
    emailNotifications: Math.random() > 0.7, // 30% chance of being true
    darkMode: Math.random() > 0.5, // 50% chance of being true
    locationServices: Math.random() > 0.2, // 80% chance of being true
    biometricAuth: Math.random() > 0.1, // 90% chance of being true
    lastUpdated: new Date()
  };
  
  // Merge default settings with any custom overrides
  const settingsData = defaultSettings;
  
  try {
    // Create and save the new settings document
    const settings = new UserSettings(settingsData);
    await settings.save();
    console.log(`Created dummy settings for user: ${userId}`);
    return settings;
  } catch (error) {
    // Handle the case where settings already exist for this user
    if (error.code === 11000) { // Duplicate key error
      console.log(`Settings already exist for user: ${userId}. Updating instead.`);
      
      // Update existing settings instead
      const updatedSettings = await UserSettings.findOneAndUpdate(
        { userId: userObjectId },
        { $set: settingsData },
        { new: true } // Return the updated document
      );
      
      return updatedSettings;
    }
    
    // Re-throw other errors
    throw error;
  }
}

/**
 * Usage example:
 * 
 * // Connect to MongoDB first
 * await mongoose.connect('mongodb://localhost:27017/your_database');
 * 
 * // Create dummy settings with default random values
 * const userId = '60d21b4667d0d8992e610c85'; // Replace with real user ID
 * const settings = await createDummySettings(userId);
 * 
 * // Or create with custom values
 * const customSettings = await createDummySettings(userId, {
 *   darkMode: true,
 *   pushNotifications: false
 * });
 * 
 * // Don't forget to close the connection when done
 * // await mongoose.connection.close();
 */

export default createDummySettings;