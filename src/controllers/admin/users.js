// File: backend/controllers/userController.js
import User from "../../models/User.js";
import {
  generateUniqueReferralCode,
  generateVendorId,
} from "../../utils/user_profile_utils.js";

// @desc    Get all users
// @route   GET /admin/users
// @access  Private
export const getUsers = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    // Filter options
    const filter = {};
    if (req.query.kycStatus) {
      filter.kycStatus = req.query.kycStatus;
    }
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === "true";
    }

    // Search term
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filter.$or = [
        { name: searchRegex },
        { phoneNumber: searchRegex },
        { businessName: searchRegex },
        { vendorId: searchRegex },
      ];
    }

    const users = await User.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      users,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user by ID
// @route   GET /admin/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("orders");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a user
// @route   POST /admin/users
// @access  Private
export const createUser = async (req, res) => {
  try {
    console.log("body", req.body);
    const {
      Name,
      phoneNumber,
      businessAddress,
      businessName,
      businessType,
      city,
      pinCode,
      state,
      isActive,
      coins,
      kycStatus,
      referralCode, //this is the referral code of the user who referred this user
    } = req.body;

    const newUser = new User({
      Name,
      phoneNumber,
      businessAddress,
      businessName,
      businessType,
      city,
      pinCode,
      state,
      isActive,
      coins,
      kycStatus,
    });

    // Check if phone number is already used
    const phoneExists = await User.findOne({
      phoneNumber: req.body.phoneNumber,
    });
    if (phoneExists) {
      return res.status(400).json({ message: "Phone number already in use" });
    }
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        newUser.referredBy = referrer._id;
        // Award 100 coins to both the referrer and the referred user
        newUser.refralWalletAmount += 100;
        referrer.refralWalletAmount += 100;
        // Add the new user to the referrer's referredTo list
        referrer.referredTo.push(newUser._id);
        // Increment the referral count for the referrer
        referrer.referralCount += 1;
        await referrer.save();
        console.log("Referral reward added: 100 coins to both users");
      }
    }
    newUser.vendorId = generateVendorId();
    newUser.referralCode = generateUniqueReferralCode(newUser.Name); //this is the referral code of the user
    const user = await User.create(newUser);

    res.status(201).json(user);
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a user
// @route   PUT /admin/users/:id
// @access  Private
export const updateUser = async (req, res) => {
  try {
   
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Define the allowed fields that can be updated
    const allowedFields = [
      'Name',
      'phoneNumber',
      'businessAddress',
      'businessName',
      'businessType',
      'city',
      'pinCode',
      'state',
      'isActive',
      "coins",
      "kycStatus",
    ];
    
    // Extract only the allowed fields that are provided in the request body
    const updatedFields = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (value !== undefined && allowedFields.includes(key)) {
        updatedFields[key] = value;
      }
    }
    // Check if phone number is already used by another user
    if (updatedFields.phoneNumber && updatedFields.phoneNumber !== user.phoneNumber) {
      const phoneExists = await User.findOne({
        phoneNumber: updatedFields.phoneNumber,
        _id: { $ne: userId } // Exclude current user from check
      });
      
      if (phoneExists) {
        return res.status(400).json({ message: "Phone number already in use" });
      }
    }
    
    // Check if vendor ID is already used by another user
    if (updatedFields.vendorId && updatedFields.vendorId !== user.vendorId) {
      const vendorIdExists = await User.findOne({
        vendorId: updatedFields.vendorId,
        _id: { $ne: userId } // Exclude current user from check
      });
      
      if (vendorIdExists) {
        return res.status(400).json({ message: "Vendor ID already in use" });
      }
    }
    
    // Update the user with findByIdAndUpdate
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { $set: updatedFields },
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a user
// @route   DELETE /admin/users/:id
// @access  Private
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
