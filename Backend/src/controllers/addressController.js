import Address from "../models/Address.js";

/* ================= GET ADDRESSES ================= */
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
};

/* ================= ADD ADDRESS ================= */
export const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      street,
      city,
      state,
      zipCode,
      country,
      isDefault = false,
      addressType = "home",
    } = req.body;

    // Basic validation
    if (
      !fullName ||
      !phoneNumber ||
      !street ||
      !city ||
      !state ||
      !zipCode ||
      !country
    ) {
      return res.status(400).json({
        success: false,
        message: "All address fields are required",
      });
    }

    // Handle default address
    if (isDefault) {
      await Address.updateMany(
        { user: req.user._id },
        { isDefault: false }
      );
    }

    const address = await Address.create({
      user: req.user._id,
      fullName,
      phoneNumber,
      street,
      city,
      state,
      zipCode,
      country,
      isDefault,
      addressType,
    });

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add address",
    });
  }
};

/* ================= UPDATE ADDRESS ================= */
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const address = await Address.findOne({
      _id: addressId,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // If setting new default, remove old default
    if (req.body.isDefault) {
      await Address.updateMany(
        { user: req.user._id },
        { isDefault: false }
      );
    }

    Object.assign(address, req.body);
    await address.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update address",
    });
  }
};

/* ================= DELETE ADDRESS ================= */
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const address = await Address.findOneAndDelete({
      _id: addressId,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete address",
    });
  }
};