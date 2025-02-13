import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const auth = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.replace("Bearer ", "");

		if (!token) {
			return res.status(401).json({
				success: false,
				message: "No authentication token provided",
			});
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId);

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "User not found",
			});
		}

		if (!user.isActive) {
			return res.status(403).json({
				success: false,
				message: "Account is deactivated",
			});
		}

		req.user = user;
		next();
	} catch (error) {
		res.status(401).json({
			success: false,
			message: "Authentication failed",
		});
	}
};
