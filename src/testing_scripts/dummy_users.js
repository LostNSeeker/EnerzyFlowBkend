import User from "../models/User.js";
import { faker } from "@faker-js/faker";

// Function to generate a unique vendor ID
const generateVendorId = () => {
  // Format: VEN-XXXXX where X is alphanumeric
  return `VEN-${faker.string.alphanumeric(5).toUpperCase()}`;
};

// Function to generate a unique referral code
const generateReferralCode = () => {
  // Format: REF-XXXXX where X is alphanumeric
  return `REF-${faker.string.alphanumeric(5).toUpperCase()}`;
};

// Function to generate a unique phone number
const generatePhoneNumber = () => {
  // Format: 10 digits starting with 9, 8, 7, or 6 (common Indian mobile prefixes)
  const prefix = faker.helpers.arrayElement(['9', '8', '7', '6']);
  const rest = faker.string.numeric(9); // 9 more random digits
  return prefix + rest;
};

// Function to generate dummy KYC document
const generateKycDocument = () => {
  const docTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  const mimeType = faker.helpers.arrayElement(docTypes);
  
  let extension;
  switch (mimeType) {
    case 'image/jpeg':
      extension = 'jpg';
      break;
    case 'image/png':
      extension = 'png';
      break;
    case 'application/pdf':
      extension = 'pdf';
      break;
  }
  
  const fileName = `document_${faker.string.alphanumeric(8)}.${extension}`;
  
  return {
    uri: `https://storage.example.com/kyc/${faker.string.uuid()}/${fileName}`,
    name: fileName,
    mimeType: mimeType,
    size: Math.floor(Math.random() * 5000000) + 500000, // Random size between 500KB and 5MB
  };
};

// Function to generate random users
export const seedUsers = async (count) => {
  try {
    console.log("Starting user seeding process...");
    
    const users = [];
    const businessTypes = ["Retail", "Wholesale", "Manufacturing", "Service", "Distribution"];
    const states = ["Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Delhi", "Uttar Pradesh"];
    const kycStatuses = ["pending", "verified", "rejected"];
    
    const phoneNumbers = new Set(); // To ensure unique phone numbers
    const vendorIds = new Set();    // To ensure unique vendor IDs
    
    for (let i = 0; i < count; i++) {
      // Generate unique phone number
      let phoneNumber;
      do {
        phoneNumber = generatePhoneNumber();
      } while (phoneNumbers.has(phoneNumber));
      phoneNumbers.add(phoneNumber);
      
      // Generate unique vendor ID
      let vendorId;
      do {
        vendorId = generateVendorId();
      } while (vendorIds.has(vendorId));
      vendorIds.add(vendorId);
      
      // Create user object
      const user = {
        Name: faker.person.fullName(),
        phoneNumber: phoneNumber,
        vendorId: vendorId,
        businessName: faker.company.name(),
        businessAddress: faker.location.streetAddress(),
        businessType: faker.helpers.arrayElement(businessTypes),
        city: faker.location.city(),
        pinCode: faker.location.zipCode(),
        state: faker.helpers.arrayElement(states),
        kycStatus: faker.helpers.arrayElement(kycStatuses),
        kycDocument: generateKycDocument(),
        coins: Math.floor(Math.random() * 5000) + 1000, // Random coins between 1000 and 6000
        referralCode: generateReferralCode(),
        isActive: Math.random() > 0.1, // 90% of users are active
        createdAt: faker.date.past({ years: 2 }) // User created sometime in the last 2 years
      };
      
      users.push(user);
    }
    
    // Second pass to handle referrals (about 30% of users are referred by someone)
    for (let i = 10; i < users.length; i++) {
      if (Math.random() < 0.3) {
        // Select a random user from the first users (to avoid circular references)
        const randomIndex = Math.floor(Math.random() * i);
        users[i].referredBy = users[randomIndex]._id; // This will be set after insertion
      }
    }
    
    // Insert users into the database
    const insertedUsers = await User.insertMany(users);
    console.log(`Successfully seeded ${insertedUsers.length} users`);
    
    // Update referredBy fields with actual _ids
    const updatePromises = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].referredBy) {
        // Find the index of the referring user and get their actual _id
        const referrerIndex = users.findIndex(user => user === users[i].referredBy);
        if (referrerIndex !== -1) {
          updatePromises.push(
            User.updateOne(
              { _id: insertedUsers[i]._id },
              { referredBy: insertedUsers[referrerIndex]._id }
            )
          );
        }
      }
    }
    
    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
      console.log(`Updated ${updatePromises.length} user referrals`);
    }
    
    // Display a sample user
    const sampleUser = await User.findOne().exec();
    console.log("Sample user:");
    console.log(JSON.stringify(sampleUser, null, 2));
    
    return { success: true, count: insertedUsers.length };
  } catch (error) {
    console.error("Error seeding users:", error);
    return { success: false, error: error.message };
  }
};

// Function to clear existing users and seed new ones
export const clearAndSeedUsers = async (count) => {
  try {
    console.log("Clearing existing users...");
    await User.deleteMany({});
    console.log("All users cleared");
    
    return await seedUsers(count);
  } catch (error) {
    console.error("Error in clear and seed operation:", error);
    return { success: false, error: error.message };
  }
};

// Example usage:
// import { seedUsers, clearAndSeedUsers } from './seedUsers.js';
// 
// // To add users without clearing existing ones:
// seedUsers(20).then(result => console.log(result));
// 
// // To clear existing users and add new ones:
// clearAndSeedUsers(20).then(result => console.log(result));