import express from "express";
import {
  getAllBooks,
  getBook,
  getFeaturedBooks,
  getNewArrivals,
  getBestSellers,
  addReview,
  getCategories,
} from "../controllers/bookController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllBooks);
router.get("/featured", getFeaturedBooks);
router.get("/new-arrivals", getNewArrivals);
router.get("/best-sellers", getBestSellers);
router.get("/categories", getCategories);
router.get("/:id", getBook);
router.post("/:bookId/reviews", protect, addReview);

export default router;
