// utils/idGenerator.js
export const generateVendorId = () => {
    // Create a vendor ID in format VEN-XXXXX where X is alphanumeric
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';
    
    // Generate 5 random characters
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomPart += characters.charAt(randomIndex);
    }
    
    // Format as VEN-XXXXX
    return `VEN-${randomPart}`;
  };
  
// utils/referralCode.js
export const generateUniqueReferralCode = (name) => {
    // Handle case where name is undefined or empty
    let namePrefix = "USR"; // Default prefix if name is not available
    
    if (name && typeof name === 'string' && name.trim() !== '') {
      // Extract first 3 chars of name and convert to uppercase
      namePrefix = name.trim().substring(0, 3).toUpperCase();
      
      // If name is shorter than 3 chars, pad with 'X'
      while (namePrefix.length < 3) {
        namePrefix += 'X';
      }
    }
    
    // For random part, use alphanumeric characters
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';
    
    // Generate 5 random characters
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomPart += characters.charAt(randomIndex);
    }
    
    return `${namePrefix}${randomPart}`;
  };