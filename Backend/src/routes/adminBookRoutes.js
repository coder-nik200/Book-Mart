import express from "express";
import multer from "multer";
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/adminBookController.js";

import adminOnly from "../middleware/role.middleware.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.use(protect, adminOnly);
router.get("/", getAllBooks);
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "additionalImages", maxCount: 5 },
  ]),
  createBook
);
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "additionalImages", maxCount: 5 },
  ]),
  updateBook
);


router.delete("/:id", deleteBook);

export default router;