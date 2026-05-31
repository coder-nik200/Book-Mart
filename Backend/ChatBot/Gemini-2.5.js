import "dotenv/config";
let ai = null;
let GoogleGenAI = null;

try {
  // Lazy-require to avoid hard crash when package requires API key at import time
  // and to allow the app to run without Gemini configured.
  GoogleGenAI = (await import('@google/genai')).GoogleGenAI;
} catch (e) {
  // Package may not be available or may throw on import; handle gracefully
  console.warn('[Gemini] @google/genai not available or failed to import:', e.message || e);
}

if (process.env.GEMINI_API_KEY && GoogleGenAI) {
  try {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (e) {
    console.warn('[Gemini] Failed to initialize GoogleGenAI:', e.message || e);
    ai = null;
  }
} else if (!process.env.GEMINI_API_KEY) {
  console.warn('[Gemini] GEMINI_API_KEY not set — ChatGPT/Gemini features are disabled');
}

const generate = async (prompt) => {
  if (!ai) {
    // Fallback reply so chat endpoints remain functional even without Gemini
    return "AI service not configured. Please set GEMINI_API_KEY to enable AI chat.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const reply = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      throw new Error("Empty Gemini response");
    }
    return reply;
  } catch (err) {
    console.error('[Gemini] generate error:', err.message || err);
    throw err;
  }
};

export default generate;
