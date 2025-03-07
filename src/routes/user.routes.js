import express from "express";
import { auth } from "../middleware/auth.js";
import * as userController from "../controllers/user/profile.controller.js";
import { validate } from "../middleware/validation.js";
import { profileValidation } from "../validators/user.validators.js";
import { getUserSettings, updateUserSettings } from "../controllers/user/settingsController.js";
import { getFAQsGroupedByCategory } from "../controllers/user/faqs.js";

const router = express.Router();

router.get("/profile", userController.getUserProfile);
router.put(
	"/profile",
	validate(profileValidation),
	userController.updateUserProfile
);
router.get("/settings", getUserSettings);
router.patch("/settings", updateUserSettings);
router.get("/faqs/grouped", getFAQsGroupedByCategory);
router.get("/coins", auth, userController.getCoinsBalance);
router.post("/refer", auth, userController.referFriend);
router.get("/referrals", auth, userController.getReferralHistory);

export default router;
