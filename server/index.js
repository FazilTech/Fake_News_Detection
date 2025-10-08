import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(bodyParser.json());

const ai = new GoogleGenAI({
  apiKey: "AIzaSyBu6koB7IbzWakAONRY_CopcpCH_yDp1ag"  
});

app.post("/api/chat", async (req, res) => {
  try {
    const { question, context } = req.body || {};
    if (!question) return res.status(400).json({ error: "question required" });

    const systemPrompt = `
You are a concise, factual assistant specialized in summarizing and answering
questions about news articles. Use the provided context (news text) to answer precisely.
If the context doesn't contain the answer, say: "I couldn't find that in the provided news."
Provide short, clear answers and include 1-2 bullet key points if relevant.
    `.trim();

    const combinedPrompt = [
      systemPrompt,
      "\n\n--- CONTEXT ---\n",
      context || "(no additional context provided)",
      "\n\n--- QUESTION ---\n",
      question,
      "\n\nAnswer:"
    ].join("");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: combinedPrompt
    });

    const answer =
      response?.text ??
      (response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "");

    res.json({ answer, raw: response });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "internal_error", details: err?.message || err });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
