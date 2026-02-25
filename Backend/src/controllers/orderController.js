import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Book from "../models/Book.js";
import Address from "../models/Address.js";
import Stripe from "stripe";
import { generateOrderNumber } from "../utils/helpers.js";
import { sendOrderConfirmationEmail } from "../utils/emailService.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ==================== CREATE ORDER ====================
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId, paymentMethod = "credit_card", couponCode } = req.body;

    // Get cart
    const cart = await Cart.findOne({ user: userId }).populate("items.book");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Get address
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    // Create order
    const orderNumber = generateOrderNumber();
    const totalPrice = cart.totalPrice;

    const order = await Order.create({
      user: userId,
      orderNumber,
      items: cart.items.map((item) => ({
        book: item.book._id,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: {
        fullName: address.fullName,
        phoneNumber: address.phoneNumber,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
      },
      totalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === "credit_card" ? "pending" : "pending",
      orderstatus: "pending",
    });

    // Clear cart
    await Cart.findOneAndUpdate({ user: userId }, { items: [], totalPrice: 0, totalItems: 0 });

    // Send confirmation email
    const user = req.user;
    const cartItems = cart.items.map((item) => ({
      bookName: item.book.title,
      quantity: item.quantity,
      price: item.price,
    }));
    await sendOrderConfirmationEmail(user.email, orderNumber, cartItems, totalPrice);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GET USER ORDERS ====================
export const getUserOrders = async (req, res) => {
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

// ==================== GET SINGLE ORDER ====================
export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId).populate("items.book");

    if (!order || order.user.toString() !== userId.toString()) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== CANCEL ORDER ====================
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(orderId);

    if (!order || order.user.toString() !== userId.toString()) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.orderstatus !== "pending" && order.orderstatus !== "confirmed") {
      return res.status(400).json({ success: false, message: "Cannot cancel this order" });
    }

    // If payment was completed, refund
    if (order.paymentStatus === "completed" && order.stripePaymentId) {
      const refund = await stripe.refunds.create({
        payment_intent: order.stripePaymentId,
      });
      order.paymentStatus = "refunded";
    }

    order.orderstatus = "cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== CREATE PAYMENT INTENT ====================
export const createPaymentIntent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Amount in cents
      currency: "usd",
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== CONFIRM PAYMENT ====================
export const confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: "completed",
          stripePaymentId: paymentIntentId,
          orderstatus: "confirmed",
        },
        { new: true }
      );

      // Update book stock
      for (const item of order.items) {
        await Book.findByIdAndUpdate(item.book, {
          $inc: { stock: -item.quantity },
        });
      }

      res.status(200).json({
        success: true,
        message: "Payment confirmed",
        order,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment not successful",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
