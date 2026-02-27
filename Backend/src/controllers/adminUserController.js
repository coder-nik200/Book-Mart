import User from "../models/User.js";

/* =========================
   GET ALL USERS (ADMIN)
========================= */
export const getAllUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   BLOCK USER (ADMIN)
========================= */
export const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        message: "Admin users cannot be blocked",
      });
    }

    user.isBlocked = true;
    await user.save();

    res.json({
      message: "User blocked successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   UNBLOCK USER (ADMIN)
========================= */
export const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = false;
    await user.save();

    res.json({
      message: "User unblocked successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};