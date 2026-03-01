import express from "express";
import { getAllOrders, updateOrderStatus } from "../controllers/adminOrderController.js";
import protect from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/role.middleware.js";


const router = express.Router();

router.use(protect, adminOnly);

router.get("/", getAllOrders);

router.put("/:id/status", updateOrderStatus);

export default router;