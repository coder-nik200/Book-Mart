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
  searchBooks,
} from "../controllers/bookController.js";

import { protect } from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", getAllBooks);
router.get("/search", searchBooks);
router.get("/featured", getFeaturedBooks);
router.get("/new-arrivals", getNewArrivals);
router.get("/best-sellers", getBestSellers);

router.get("/categories", getCategories);

router.get("/:id", getBook);

router.post("/:bookId/reviews", protect, addReview);


router.post("/", protect, adminOnly, createBook);

router.put("/:id", protect, adminOnly, updateBook);

router.delete("/:id", protect, adminOnly, deleteBook);

export default router;