import { User } from '../../models/User.js';
import { validatePinCode } from '../../utils/validators.js';

export const addAddress = async (req, res) => {
  try {
    const { street, city, state, pinCode, country = 'India' } = req.body;

    if (!validatePinCode(pinCode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid PIN code format'
      });
    }

    const user = await User.findById(req.user._id);
    
    const newAddress = {
      street,
      city,
      state,
      pinCode,
      country
    };

    user.shippingAddresses = user.shippingAddresses || [];
    user.shippingAddresses.push(newAddress);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: newAddress
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to add address'
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { street, city, state, pinCode, country } = req.body;

    if (pinCode && !validatePinCode(pinCode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid PIN code format'
      });
    }

    const user = await User.findById(req.user._id);
    const addressIndex = user.shippingAddresses.findIndex(
      addr => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    user.shippingAddresses[addressIndex] = {
      ...user.shippingAddresses[addressIndex],
      street: street || user.shippingAddresses[addressIndex].street,
      city: city || user.shippingAddresses[addressIndex].city,
      state: state || user.shippingAddresses[addressIndex].state,
      pinCode: pinCode || user.shippingAddresses[addressIndex].pinCode,
      country: country || user.shippingAddresses[addressIndex].country
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: user.shippingAddresses[addressIndex]
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update address'
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user._id);
    user.shippingAddresses = user.shippingAddresses.filter(
      addr => addr._id.toString() !== addressId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete address'
    });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('shippingAddresses');

    res.status(200).json({
      success: true,
      data: user.shippingAddresses || []
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch addresses'
    });
  }
};
