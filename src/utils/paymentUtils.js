import * as dotenv from "dotenv";
dotenv.config();
import Razorpay from "razorpay";

const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createPaymentOrder = async (amount, orderId) => {
	try {
		const options = {
			amount: amount * 100, // Razorpay expects amount in paise
			currency: "INR",
			receipt: orderId,
			payment_capture: 1,
		};
		const order = await razorpay.orders.create(options);
		return { success: true, order };
	} catch (error) {
		console.error("Payment order creation failed:", error);
		throw new Error("Failed to create payment order");
	}
};

export const verifyPayment = (orderId, paymentId, signature) => {
	const generatedSignature = crypto
		.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
		.update(orderId + "|" + paymentId)
		.digest("hex");
	return generatedSignature === signature;
};
