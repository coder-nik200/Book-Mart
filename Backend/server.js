import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import "express-async-errors";
import connectDB from "./src/config/db.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import authRoutes from "./src/routes/authRoutes.js";
import bookRoutes from "./src/routes/bookRoutes.js";
import addressRoutes from "./src/routes/addresRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import wishlistRoutes from "./src/routes/wishlistRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import adminBookRoutes from "./src/routes/adminBookRoutes.js";
import adminOrderRoutes from "./src/routes/adminOrderRoutes.js";
import adminUserRoutes from "./src/routes/adminUserRoutes.js";
import adminDashboardRoutes from "./src/routes/adminDashboardRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import chatRoute from "./src/routes/chatRouter.js";

import path from "path";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use("/upload", express.static(path.join(process.cwd(), "upload")));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

connectDB();
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/books", adminBookRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/user/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatRoute);
app.get("/", (req, res) => {
  res.json({ message: "BookMart API is running" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
