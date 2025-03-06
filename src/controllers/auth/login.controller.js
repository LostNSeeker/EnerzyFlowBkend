import { loginService, verifyOTPService } from "../../services/auth.service.js";
import { validatePhoneNumber } from "../../utils/validators.js";

export const login = async (req, res) => {
	try {
		const { phoneNumber, vendorId } = req.body;
		
		if (!validatePhoneNumber(phoneNumber)) {
			return res.status(400).json({
				success: false,
				message: "Invalid phone number format",
			});
		}
		// console.log(req.body)
		await loginService(phoneNumber, vendorId);

		res.status(200).json({
			success: true,
			message: "OTP sent successfully",
			phoneNumber,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Login failed",
		});
	}
};

export const verifyOTP = async (req, res) => {
	try {
		const { phoneNumber, otp } = req.body;

		if (!validatePhoneNumber(phoneNumber)) {
			return res.status(400).json({
				success: false,
				message: "Invalid phone number format",
			});
		}

		const { token, user } = await verifyOTPService(phoneNumber, otp);

		res.status(200).json({
			success: true,
			message: "OTP verified successfully",
			token,
			user,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "OTP verification failed",
		});
	}
};

export const setupProfile = async (req, res) => {
	try {
		console.log(req.body)
		const { name, email } = req.body;

		if (!name || !email) {
			return res.status(400).json({
				success: false,
				message: "Name and email are required",
			});
		}

		const user = await setupProfileService(req.user._id, { name, email });

		res.status(200).json({
			success: true,
			message: "Profile updated successfully",
			user,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Profile update failed",
		});
	}
};

export const uploadKYC = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: "KYC document is required",
			});
		}

		req.user.kyc = req.file.filename;
		await req.user.save();

		res.status(200).json({
			success: true,
			message: "KYC document uploaded successfully",
			user: req.user,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "KYC upload failed",
		});
	}
};
