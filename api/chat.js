// api/chat.js (serverless function)
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // store your key securely
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, mode } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  // Define system prompt based on AI mode
  let systemPrompt = "You are an AI educator. Explain clearly and simply.";

  if (mode === "friendly") {
    systemPrompt = "You are a friendly tutor. Use simple language and emojis.";
  } else if (mode === "researcher") {
    systemPrompt = "You are a deep researcher. Provide detailed analysis and explanations.";
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano", // ✅ GPT-5 Nano
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500, // adjust based on your needs
      temperature: 0.7
    });

    const reply = completion.choices[0]?.message?.content || "No response 😔";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "Server error — check logs" });
  }
}
