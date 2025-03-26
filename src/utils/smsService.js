import twilio from 'twilio';

export const generateOTP = () => {
  return Math.floor(999 + Math.random() * 9000).toString();
};

export const sendSMS = async (to, message) => {
  try {
    // Check if environment variables are set
    to="+91"+to;
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.warn('Twilio credentials not properly configured in environment variables');
      console.log(`Would send "${message}" to ${to}`);
      
      // For development, just log the OTP and return success without actually sending SMS
      return { 
        success: true, 
        messageId: 'dev-mode', 
        note: 'SMS not actually sent - development mode'
      };
    }
    console.log("Initialize Twilio client")
    // Initialize Twilio client
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log("twilio object created")
    // Send the actual SMS
    const response = await client.messages.create({
      body: message,
      to,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    console.log("SMS sent successfully:", response.sid);
    return { success: true, messageId: response.sid };
  } catch (error) {
    console.error('SMS sending failed:', error);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
};