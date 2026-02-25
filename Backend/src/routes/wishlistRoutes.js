import express from "express";
import { getWishlist, addToWishlist, removeFromWishlist, isInWishlist } from "../controllers/wishlistController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getWishlist);
router.post("/add", protect, addToWishlist);
router.delete("/:bookId", protect, removeFromWishlist);
router.get("/check/:bookId", protect, isInWishlist);

export default router;
