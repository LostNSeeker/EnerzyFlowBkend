import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const otpSchema = new mongoose.Schema({
	phoneNumber: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	vendorId: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	otp: {
		type: String,
		required: true,
	},
	expiry: {
		type: Date,
		required: true,
	},
});

otpSchema.pre("save", async function (next) {
	const otp = this;
	if (otp.isModified("otp")) {
		otp.otp = await bcrypt.hash(otp.otp, 8);
	}
	next();
});

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
