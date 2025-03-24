export const generateVendorId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';
    
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomPart += characters.charAt(randomIndex);
    }
    
    return `VEN-${randomPart}`;
  };
  
export const generateUniqueReferralCode = (name) => {
    
  let namePrefix;
    if (name && typeof name === 'string' && name.trim() !== '') {
      namePrefix = name.trim().substring(0, 3).toUpperCase();
      
      while (namePrefix.length < 3) {
        namePrefix += 'X';
      }
    }
    
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';
    
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomPart += characters.charAt(randomIndex);
    }
    
    return `${namePrefix}${randomPart}`;
  };