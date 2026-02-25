import express from "express";
import { signup, login, refreshAccessToken, forgotPassword, resetPassword, getCurrentUser, logout } from "../controllers/authController.js";
import { protect, refreshTokenMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshTokenMiddleware, refreshAccessToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", protect, resetPassword);
router.get("/current-user", protect, getCurrentUser);
router.post("/logout", protect, logout);

export default router;
