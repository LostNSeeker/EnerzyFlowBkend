import twilio from 'twilio';

const twilioConfig = {
  client: twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  ),

  settings: {
    from: process.env.TWILIO_PHONE_NUMBER,
    region: 'in1', // India region
    messageRetention: '4' // Days to retain messages
  },

  templates: {
    otp: 'Your EnerzyFlow OTP is: {{otp}}. Valid for 5 minutes.',
    orderConfirmation: 'Order #{{orderId}} confirmed! Amount: ₹{{amount}}. Track your order on the EnerzyFlow app.',
    orderStatus: 'Your order #{{orderId}} is {{status}}. Track on EnerzyFlow app for updates.',
    delivery: 'Good news! Your order #{{orderId}} will be delivered on {{date}}.',
    welcome: 'Welcome to EnerzyFlow! Your account has been successfully created.',
    referral: '{{businessName}} has invited you to join EnerzyFlow! Download the app to get started.'
  },

  // SMS sending options
  options: {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    validityPeriod: 300 // 5 minutes
  }
};

export const sendSMS = async (to, template, variables) => {
  try {
    let message = twilioConfig.templates[template];
    
    // Replace variables in template
    Object.keys(variables).forEach(key => {
      message = message.replace(`{{${key}}}`, variables[key]);
    });

    const response = await twilioConfig.client.messages.create({
      body: message,
      to: to.startsWith('+91') ? to : `+91${to}`,
      from: twilioConfig.settings.from,
      validityPeriod: twilioConfig.options.validityPeriod
    });

    return { 
      success: true, 
      messageId: response.sid 
    };

  } catch (error) {
    console.error('SMS sending failed:', error);
    // Implement retry logic
    if (error.status === 429) { // Too Many Requests
      // Implement exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, twilioConfig.options.retryDelay)
      );
      return sendSMS(to, template, variables); // Retry
    }
    throw new Error('Failed to send SMS');
  }
};

// Helper function to validate Indian phone numbers
export const validatePhoneNumber = (phoneNumber) => {
  const regex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
  return regex.test(phoneNumber);
};

export default twilioConfig;