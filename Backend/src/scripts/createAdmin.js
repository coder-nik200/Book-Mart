import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB ✅");

    const ADMIN_NAME = process.env.ADMIN_NAME || "BookMart Admin";
    const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@bookmart.com").toLowerCase();
    const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

    const adminExists = await User.findOne({ email: ADMIN_EMAIL });
    if (adminExists) {
      console.log("❌ Admin already exists");
      process.exit(0);
    }

    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASS, // 🔥 PLAIN password
      role: "admin",
      isBlocked: false,
    });

    console.log("✅ Admin created successfully");
    console.log("Email:", ADMIN_EMAIL);
    console.log("Password:", ADMIN_PASS);
    process.exit(0);

  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();