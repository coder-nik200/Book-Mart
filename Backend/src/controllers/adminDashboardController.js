import Book from "../models/Book.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

/* =========================
   DASHBOARD STATS (ADMIN)
========================= */
export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();

    // Total revenue (completed payments only)
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: "completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Orders by status
    const pendingOrders = await Order.countDocuments({ orderstatus: "pending" });
    const deliveredOrders = await Order.countDocuments({ orderstatus: "delivered" });

    // Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    const todayRevenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: "completed",
          createdAt: { $gte: today },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);
    const todayRevenue = todayRevenueResult[0]?.total || 0;

    res.json({
      totalOrders,
      totalUsers,
      totalBooks,
      totalRevenue,

      pendingOrders,
      deliveredOrders,

      todayOrders,
      todayRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};