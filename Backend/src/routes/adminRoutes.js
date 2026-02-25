import express from "express";
import {
  getDashboardStats,
  addBook,
  updateBook,
  deleteBook,
  addCategory,
  updateCategory,
  deleteCategory,
  getAllUsers,
  blockUser,
  unblockUser,
  updateOrderStatus,
  getAllOrders,
  getAllReviews,
  deleteReview,
} from "../controllers/adminController.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", protect, authorize("admin"), getDashboardStats);

// Books Management
router.post("/books", protect, authorize("admin"), addBook);
router.put("/books/:bookId", protect, authorize("admin"), updateBook);
router.delete("/books/:bookId", protect, authorize("admin"), deleteBook);

// Categories Management
router.post("/categories", protect, authorize("admin"), addCategory);
router.put("/categories/:categoryId", protect, authorize("admin"), updateCategory);
router.delete("/categories/:categoryId", protect, authorize("admin"), deleteCategory);

// Users Management
router.get("/users", protect, authorize("admin"), getAllUsers);
router.put("/users/:userId/block", protect, authorize("admin"), blockUser);
router.put("/users/:userId/unblock", protect, authorize("admin"), unblockUser);

// Orders Management
router.get("/orders", protect, authorize("admin"), getAllOrders);
router.put("/orders/:orderId/status", protect, authorize("admin"), updateOrderStatus);

// Reviews Management
router.get("/reviews", protect, authorize("admin"), getAllReviews);
router.delete("/reviews/:reviewId", protect, authorize("admin"), deleteReview);

export default router;
