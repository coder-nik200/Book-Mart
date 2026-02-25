import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db";
dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.json("Hi");
});

connectDB();

app.listen(process.env.PORT, (req, res) => {
  console.log("🚀 Server is running on PORT 3000");
});
