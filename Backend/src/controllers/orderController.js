import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const generateOrderNumber = () => {
  return `BM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod, totalPrice } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  if (!shippingAddress || !paymentMethod || !totalPrice) {
    return res.status(400).json({ message: "Missing data" });
  }
  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
    totalPrice,
    orderNumber: generateOrderNumber(), 
    shippingCost: 0,
    taxAmount: totalPrice * 0.1, 
  });

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
};

export const getUserOrders = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate("items.book", "title image price");

  res.json({
    success: true,
    orders,
  });
};


export const getOrder = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
    user: req.user._id,
  }).populate("items.book", "title image price");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json({
    success: true,
    order,
  });
};

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


export const createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, 
    currency: "usd",
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
  });
};


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

  await Cart.findOneAndDelete({ user: req.user._id });

  res.json({
    success: true,
    message: "Payment confirmed",
  });
};
