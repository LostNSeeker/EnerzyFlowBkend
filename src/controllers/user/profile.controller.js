import User from "../../models/User.js";

export const getUserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-__v");
		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Failed to fetch profile",
		});
	}
};

export const updateUserProfile = async (req, res) => {
	try {
		const { businessName,businessType, businessAddress, city, state, pinCode } = req.body;

		const user = await User.findByIdAndUpdate(
			req.user._id,
			{
				businessName,
				businessType,
				businessAddress,
				city,
				state,
				pinCode,
			},
			{ new: true }
		);

		res.status(200).json({
			success: true,
			message: "Profile updated successfully",
			data: user,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Failed to update profile",
		});
	}
};

export const getCoinsBalance = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("coins");

		res.status(200).json({
			success: true,
			data: user.coins,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Failed to fetch coins balance",
		});
	}
};

export const referFriend = async (req, res) => {
	try {
		const { phoneNumber } = req.body;

		const referral = await Referral.create({
			referrer: req.user._id,
			phoneNumber,
			status: "pending",
		});

		// Send referral SMS
		await sendSMS(phoneNumber, "referral", {
			businessName: req.user.businessName,
		});

		res.status(200).json({
			success: true,
			message: "Referral invitation sent successfully",
			data: referral,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Failed to send referral",
		});
	}
};

export const getReferralHistory = async (req, res) => {
	try {
		const referrals = await Referral.find({ referrer: req.user._id }).sort({
			createdAt: -1,
		});

		res.status(200).json({
			success: true,
			data: referrals,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message || "Failed to fetch referrals",
		});
	}
};
