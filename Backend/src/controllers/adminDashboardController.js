import Book from "../models/Book.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
  try {
    const rangeDays = Number(req.query.days) || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (rangeDays - 1));
    startDate.setHours(0, 0, 0, 0);

    const previousStart = new Date(startDate);
    previousStart.setDate(previousStart.getDate() - rangeDays);

    const [totalOrders, totalUsers, totalBooks] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Book.countDocuments(),
    ]);

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    const todayRevenueAgg = await Order.aggregate([
      {
        $match: {
          paymentStatus: "completed",
          createdAt: { $gte: today },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const todayRevenue = todayRevenueAgg[0]?.total || 0;

    const orderStatusAgg = await Order.aggregate([
      { $group: { _id: "$orderstatus", count: { $sum: 1 } } },
    ]);

    const orderStatusDistribution = orderStatusAgg.map((o) => ({
      name: o._id,
      value: o.count,
    }));

    const revenueByDateAgg = await Order.aggregate([
      {
        $match: {
          paymentStatus: "completed",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const revenueByDate = revenueByDateAgg.map((d) => ({
      date: d._id,
      revenue: d.revenue,
    }));

    const topSellingBooks = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.book",
          sales: { $sum: "$items.quantity" },
        },
      },
      { $sort: { sales: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      {
        $project: {
          title: "$book.title",
          sales: 1,
        },
      },
    ]);

    const currentOrders = await Order.countDocuments({
      createdAt: { $gte: startDate },
    });
    const previousOrders = await Order.countDocuments({
      createdAt: { $gte: previousStart, $lt: startDate },
    });

    const currentUsers = await User.countDocuments({
      createdAt: { $gte: startDate },
    });
    const previousUsers = await User.countDocuments({
      createdAt: { $gte: previousStart, $lt: startDate },
    });

    const revenueCurrentAgg = await Order.aggregate([
      {
        $match: {
          paymentStatus: "completed",
          createdAt: { $gte: startDate },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const revenuePrevAgg = await Order.aggregate([
      {
        $match: {
          paymentStatus: "completed",
          createdAt: { $gte: previousStart, $lt: startDate },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const revenueCurrent = revenueCurrentAgg[0]?.total || 0;
    const revenuePrevious = revenuePrevAgg[0]?.total || 0;

    const growth = {
      orderGrowth:
        previousOrders === 0
          ? 100
          : (((currentOrders - previousOrders) / previousOrders) * 100).toFixed(
              1,
            ),
      userGrowth:
        previousUsers === 0
          ? 100
          : (((currentUsers - previousUsers) / previousUsers) * 100).toFixed(1),
      revenueGrowth:
        revenuePrevious === 0
          ? 100
          : (
              ((revenueCurrent - revenuePrevious) / revenuePrevious) *
              100
            ).toFixed(1),
    };

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .select("_id createdAt");

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select("createdAt");

    const recentActivity = [
      ...recentOrders.map((o) => ({
        message: `New order placed (#${o._id.toString().slice(-6)})`,
        time: o.createdAt,
      })),
      ...recentUsers.map(() => ({
        message: "New user registered",
        time: new Date(),
      })),
    ]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 4);

    res.status(200).json({
      success: true,
      data: {
        rangeDays,

        totalOrders,
        totalUsers,
        totalBooks,
        totalRevenue,

        todayOrders,
        todayRevenue,

        orderStatusDistribution,
        revenueByDate,

        topSellingBooks,
        growth,

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
