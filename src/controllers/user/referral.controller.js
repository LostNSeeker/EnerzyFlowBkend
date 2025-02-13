// controllers/user/referral.controller.js
import { User } from '../../models/User.js';
import { Referral } from '../../models/Referral.js';
import { validatePhoneNumber } from '../../utils/validators.js';
import { sendSMS } from '../../services/notification.service.js';
import { REFERRAL_COINS } from '../../constants/payment.constants.js';

export const referFriend = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format'
      });
    }

    // Check if phone number is already registered
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'This number is already registered'
      });
    }

    // Create referral record
    const referral = await Referral.create({
      referrer: req.user._id,
      phoneNumber,
      status: 'pending'
    });

    // Send referral SMS
    await sendSMS(phoneNumber, 'referral', {
      businessName: req.user.businessName
    });

    res.status(200).json({
      success: true,
      message: 'Referral invitation sent successfully',
      data: referral
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to send referral'
    });
  }
};

export const getReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find({ referrer: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: referrals
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch referrals'
    });
  }
};

export const claimReferralReward = async (req, res) => {
  try {
    const { referralId } = req.params;

    const referral = await Referral.findOne({
      _id: referralId,
      referrer: req.user._id,
      status: 'pending'
    });

    if (!referral) {
      return res.status(404).json({
        success: false,
        message: 'Referral not found or already claimed'
      });
    }

    // Update user's coins balance
    await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { coins: REFERRAL_COINS } }
    );

    // Update referral status
    referral.status = 'completed';
    referral.coinsAwarded = REFERRAL_COINS;
    await referral.save();

    res.status(200).json({
      success: true,
      message: `${REFERRAL_COINS} coins added to your account`,
      data: referral
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to claim referral reward'
    });
  }
};

export const getReferralStats = async (req, res) => {
  try {
    const stats = await Referral.aggregate([
      { $match: { referrer: req.user._id } },
      { 
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalCoins: { $sum: '$coinsAwarded' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch referral statistics'
    });
  }
};