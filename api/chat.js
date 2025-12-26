// api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, mode } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    // Determine system prompt based on mode
    const systemPrompt =
      mode === "researcher" ? "You are a detailed researcher." :
      mode === "friendly" ? "You are a friendly tutor. Use simple language and emojis." :
      "You are an AI educator. Explain clearly and simply.";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-nano",  // your chosen model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 500
      })
    });

    const data = await response.json();

    // Extract assistant reply safely
    const reply = data.choices?.[0]?.message?.content || "Sorry, no response.";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
