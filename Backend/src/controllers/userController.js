import User from "../models/User.js";
import Address from "../models/Address.js";
import Order from "../models/Order.js";

// ==================== GET USER PROFILE ====================
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== UPDATE USER PROFILE ====================
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated",
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== CHANGE PASSWORD ====================
export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "New passwords do not match" });
    }

    const user = await User.findById(userId).select("+password");

    const isPasswordCorrect = await user.matchPassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET ALL ADDRESSES ====================
export const getAddresses = async (req, res) => {
  try {
    const userId = req.user._id;

    const addresses = await Address.find({ user: userId });

    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADD ADDRESS ====================
export const addAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, phoneNumber, street, city, state, zipCode, country, isDefault, addressType } = req.body;

    if (isDefault) {
      // Remove default from other addresses
      await Address.updateMany({ user: userId }, { isDefault: false });
    }

    const address = await Address.create({
      user: userId,
      fullName,
      phoneNumber,
      street,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault || false,
      addressType: addressType || "home",
    });

    res.status(201).json({
      success: true,
      message: "Address added",
      address,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== UPDATE ADDRESS ====================
export const updateAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;
    const { fullName, phoneNumber, street, city, state, zipCode, country, isDefault, addressType } = req.body;

    const address = await Address.findById(addressId);
    if (!address || address.user.toString() !== userId.toString()) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    if (isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
    }

    Object.assign(address, {
      fullName,
      phoneNumber,
      street,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault !== undefined ? isDefault : address.isDefault,
      addressType: addressType || address.addressType,
    });

    await address.save();

    res.status(200).json({
      success: true,
      message: "Address updated",
      address,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== DELETE ADDRESS ====================
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;

    const address = await Address.findById(addressId);
    if (!address || address.user.toString() !== userId.toString()) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    await Address.findByIdAndDelete(addressId);

    res.status(200).json({
      success: true,
      message: "Address deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET ORDER HISTORY ====================
export const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: userId })
      .populate("items.book")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Order.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
