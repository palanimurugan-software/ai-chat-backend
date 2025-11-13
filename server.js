
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  console.log('message',message)

// ✅ Use correct model name
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
//const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: message }] }],
    });
// console.log('result',result)
    // ✅ Updated response extraction
     const text =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "(No response text found)";

    res.json({ reply: text });
  } catch (err) {
    console.error("Error calling Gemini:", err);
    res.status(500).json({ error: "Failed to fetch response from Gemini" });
  }
});

app.listen(5000, () => console.log("✅ AI Chat Backend running on port 5000"));
