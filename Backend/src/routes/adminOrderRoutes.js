import express from "express";
import { getAllOrders, updateOrderStatus } from "../controllers/adminOrderController.js";
import protect from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/role.middleware.js";


const router = express.Router();

/*
  All routes below require:
  - User must be authenticated
  - User must have role: "admin"
*/

router.use(protect, adminOnly);

/* =========================
   GET ALL ORDERS
   GET /api/admin/orders
========================= */
router.get("/", getAllOrders);

/* =========================
   UPDATE ORDER STATUS
   PUT /api/admin/orders/:id/status
   Body: { orderstatus: "pending" | "delivered" }
========================= */
router.put("/:id/status", updateOrderStatus);

export default router;