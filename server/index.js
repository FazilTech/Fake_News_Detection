// apiKey: "AIzaSyBZv8om0lzI7CaEVmc7gbFjIXbgvCSMjzY" 

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: "AIzaSyBZv8om0lzI7CaEVmc7gbFjIXbgvCSMjzY"
});

// Route
app.post("/api/chat", async (req, res) => {
  try {
    const { question, context } = req.body || {};

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    // Smart context fallback
    const safeContext =
      context && context.trim() !== "" ? context : question;

    // Improved system prompt
    const systemPrompt = `
You are an intelligent news assistant.

Rules:
- Understand questions even with spelling mistakes.
- If only a headline is given, explain its meaning clearly.
- Always try to answer based on available context.
- Keep answers short (2-3 lines max).
- Add 1-2 bullet points if useful.
- Do NOT say "not found" unless completely unrelated.

Be clear, simple, and factual.
    `.trim();

    const combinedPrompt = `
${systemPrompt}

--- NEWS CONTEXT ---
${safeContext}

--- QUESTION ---
${question}

Answer:
    `;

    // Gemini API call
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: combinedPrompt,
      config: {
        temperature: 0.7
      }
    });

    const answer =
      response?.text ??
      response?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No response generated.";

    res.json({
      answer: answer.trim()
    });

  } catch (err) {
    console.error("Chat error:", err);

    res.status(500).json({
      error: "internal_error",
      message: err?.message || "Something went wrong"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});