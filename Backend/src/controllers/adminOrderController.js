import Order from "../models/Order.js";

/* =========================
   GET ALL ORDERS (ADMIN)
========================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.book", "title price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   TOGGLE ORDER STATUS (ADMIN)
   Only pending <-> delivered
========================= */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderstatus } = req.body;

    // Only allow two statuses
    const allowedStatuses = ["pending", "delivered"];

    if (!allowedStatuses.includes(orderstatus)) {
      return res.status(400).json({
        message: "Only 'pending' or 'delivered' allowed",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderstatus = orderstatus;

    // Business rule:
    if (orderstatus === "delivered") {
      order.paymentStatus = "completed";
    }

    await order.save();

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};