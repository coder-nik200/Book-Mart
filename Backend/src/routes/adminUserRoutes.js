import express from "express";
import {
  getAllUsers,
  blockUser,
  unblockUser,
} from "../controllers/adminUserController.js";
import adminOnly from "../middleware/role.middleware.js";
import protect from "../middleware/auth.middleware.js";


const router = express.Router();

router.use(protect, adminOnly);

router.get("/", getAllUsers);
router.put("/:id/block", blockUser);
router.put("/:id/unblock", unblockUser);

export default router;