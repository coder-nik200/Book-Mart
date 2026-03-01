import fs from "fs";
import path from "path";
import generate from "../../ChatBot/Gemini-2.5.js";

const fallBackReplies = JSON.parse(
  fs.readFileSync(path.resolve("./src/data/fallBackReplies.json"), "utf-8"),
);

const getFallBackReply = (message) => {
  const lower = message.toLowerCase();
  const found = fallBackReplies.find((f) => lower.includes(f.keyword));
  return found ? found.reply : "Sorry, I didn't understand that 🤔";
};

const geminiController = async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.json({ reply: "Please ask something 🙂" });
  }

  try {
    const reply = await generate(message);

    return res.json({
      reply,
      mode: "gemini",
    });
  } catch (error) {
    console.error("❌ Gemini failed → using fallback 🤖");

    const fallbackReply = getFallBackReply(message);

    return res.json({
      reply: fallbackReply,
      mode: "fallback",
    });
  }
};

export default geminiController;
