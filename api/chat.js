// api/chat.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // <-- MUST be set in your environment
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { message, mode } = req.body;

  if (!message) return res.status(400).json({ error: "No message provided" });

  try {
    // Choose prompt based on mode
    const systemPrompt =
      mode === "researcher"
        ? "You are a deep researcher. Provide detailed analysis."
        : mode === "friendly"
        ? "You are a friendly tutor. Use simple language and emojis."
        : "You are an AI educator. Explain clearly and simply.";

    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7
    });

    const reply = response.choices[0].message.content;
    res.status(200).json({ reply });

  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Server error contacting OpenAI" });
  }
                          }
