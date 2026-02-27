import express from "express";
import {
  getAllBooks,
  getBook,
  getFeaturedBooks,
  getNewArrivals,
  getBestSellers,
  addReview,
  getCategories,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";

import { protect } from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/role.middleware.js";

const router = express.Router();

/* =======================
   PUBLIC ROUTES
======================= */

// Get all books (filters, search, pagination)
router.get("/", getAllBooks);

// Home page sections
router.get("/featured", getFeaturedBooks);
router.get("/new-arrivals", getNewArrivals);
router.get("/best-sellers", getBestSellers);

// Categories
router.get("/categories", getCategories);

// Single book
router.get("/:id", getBook);

/* =======================
   USER ROUTES
======================= */

// Add review (logged-in users)
router.post("/:bookId/reviews", protect, addReview);

/* =======================
   ADMIN ROUTES
======================= */

// Create book
router.post("/", protect, adminOnly, createBook);

// Update book
router.put("/:id", protect, adminOnly, updateBook);

// Delete book
router.delete("/:id", protect, adminOnly, deleteBook);

export default router;