import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendOrderConfirmation = async (phoneNumber, orderId, amount) => {
  const message = `Your order #${orderId} has been confirmed. Amount: ₹${amount}`;
  await client.messages.create({
    body: message,
    to: phoneNumber,
    from: process.env.TWILIO_PHONE_NUMBER
  });
};

export const sendOrderStatusUpdate = async (phoneNumber, orderId, status) => {
  const message = `Your order #${orderId} status has been updated to: ${status}`;
  await client.messages.create({
    body: message,
    to: phoneNumber,
    from: process.env.TWILIO_PHONE_NUMBER
  });
};

export const sendDeliveryNotification = async (phoneNumber, orderId, date) => {
  const formattedDate = new Date(date).toLocaleDateString();
  const message = `Your order #${orderId} will be delivered on ${formattedDate}`;
  await client.messages.create({
    body: message,
    to: phoneNumber,
    from: process.env.TWILIO_PHONE_NUMBER
  });
};
