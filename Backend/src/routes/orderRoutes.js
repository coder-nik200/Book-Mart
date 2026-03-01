import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrder,
  cancelOrder,
  createPaymentIntent,
  confirmPayment,
} from "../controllers/orderController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/create", createOrder);
router.get("/my-orders", getUserOrders);
router.get("/:orderId", getOrder);
router.put("/:orderId/cancel", cancelOrder);
router.post("/payment-intent", createPaymentIntent);
router.post("/confirm-payment", confirmPayment);

export default router;
