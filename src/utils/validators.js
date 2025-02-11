export const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };
  
  export const validatePinCode = (pinCode) => {
    const pinCodeRegex = /^[1-9][0-9]{5}$/;
    return pinCodeRegex.test(pinCode);
  };
  
  export const validateVendorId = (vendorId) => {
    // Customize this based on your vendor ID format
    const vendorIdRegex = /^[A-Z0-9]{6,10}$/;
    return vendorIdRegex.test(vendorId);
  };