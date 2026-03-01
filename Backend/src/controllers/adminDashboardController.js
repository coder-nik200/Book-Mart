
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

    /* ===== TOTAL REVENUE (COMPLETED PAYMENTS) ===== */
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

    /* ===== ORDER STATUS COUNTS ===== */
    const pendingOrders = await Order.countDocuments({
      orderstatus: "pending",
    });
    const deliveredOrders = await Order.countDocuments({
      orderstatus: "delivered",
    });

    /* ===== TODAY STATS ===== */
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

    /* ===== RECENT ACTIVITY (LIGHTWEIGHT) ===== */
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .select("_id createdAt");

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select("createdAt");

    const recentActivity = [
      ...recentOrders.map((order) => ({
        message: `New order placed (#${order._id.toString().slice(-6)})`,
        time: order.createdAt,
      })),
      ...recentUsers.map((user) => ({
        message: "New user registered",
        time: user.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 4);

    /* ===== FINAL RESPONSE ===== */
    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalUsers,
        totalBooks,
        totalRevenue,

        pendingOrders,
        deliveredOrders,

        todayOrders,
        todayRevenue,

        recentActivity,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};