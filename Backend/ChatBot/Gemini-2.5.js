// require("dotenv").config();
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Function to generate AI response
const generate = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    // Correctly extract the text from parts
    const reply = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      throw new Error("Empty Gemini response");
    }

    return reply;
  } catch (err) {
    // console.error("Gemini generate error:", err.message);

    // 🔥 CRITICAL FIX
    throw err; // ✅ DO NOT RETURN STRING
  }
};

export default generate;
