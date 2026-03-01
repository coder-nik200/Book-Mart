import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Generate a simple unique order number
const generateOrderNumber = () => {
  return `BM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * 1️⃣ CREATE ORDER
 */
export const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, totalPrice } = req.body;

  // Validate request
  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  if (!shippingAddress || !paymentMethod || !totalPrice) {
    return res.status(400).json({ message: "Missing data" });
  }

  // Create order
  const order = await Order.create({
    user: req.user._id, // Make sure authMiddleware sets req.user
    items,
    shippingAddress,
    paymentMethod,
    totalPrice,
    orderNumber: generateOrderNumber(), // ✅ Add orderNumber
    shippingCost: 0,
    taxAmount: totalPrice * 0.1, // Example 10% tax
  });

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
};

/**
 * 2️⃣ GET USER ORDERS
 */
export const getUserOrders = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate("items.book", "title image price"); // <-- populate the book details

  res.json({
    success: true,
    orders,
  });
};

/**
 * 3️⃣ GET SINGLE ORDER
 */
export const getOrder = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
    user: req.user._id,
  }).populate("items.book", "title image price"); // <-- populate book

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json({
    success: true,
    order,
  });
};

/**
 * 4️⃣ CANCEL ORDER
 */
export const cancelOrder = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
    user: req.user._id,
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status !== "Pending") {
    return res.status(400).json({
      message: "Only pending orders can be cancelled",
    });
  }

  order.status = "Cancelled";
  await order.save();

  res.json({
    success: true,
    message: "Order cancelled successfully",
  });
};

/**
 * 5️⃣ CREATE STRIPE PAYMENT INTENT
 */
export const createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // convert to cents
    currency: "usd",
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
  });
};

/**
 * 6️⃣ CONFIRM PAYMENT
 */
export const confirmPayment = async (req, res) => {
  const { orderId, paymentIntentId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = "Paid";
  order.paymentIntentId = paymentIntentId;
  order.paidAt = Date.now();

  await order.save();

  // Optional: Clear cart after payment
  await Cart.findOneAndDelete({ user: req.user._id });

  res.json({
    success: true,
    message: "Payment confirmed",
  });
};
