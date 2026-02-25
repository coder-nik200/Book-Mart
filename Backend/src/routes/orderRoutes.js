import express from "express";
import { createOrder, getUserOrders, getOrder, cancelOrder, createPaymentIntent, confirmPayment } from "../controllers/orderController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", protect, createOrder);
router.get("/my-orders", protect, getUserOrders);
router.get("/:orderId", protect, getOrder);
router.put("/:orderId/cancel", protect, cancelOrder);
router.post("/payment-intent", protect, createPaymentIntent);
router.post("/confirm-payment", protect, confirmPayment);

export default router;
