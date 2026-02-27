import express from "express";
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/adminBookController.js";


import adminOnly from "../middleware/role.middleware.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

/*
  RULES:
  - Only admin can access these routes
  - protect MUST come before authorize
*/

router.use(protect,adminOnly);

// GET all books (admin)
router.get("/", getAllBooks);

// CREATE book
router.post("/", createBook);

// UPDATE book
router.put("/:id", updateBook);

// DELETE book
router.delete("/:id", deleteBook);

export default router;