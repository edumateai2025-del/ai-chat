// /api/chat.js
export default async function handler(req, res) {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ reply: "No question received." });
  }

  try {
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5-nano",
        messages: [
          { role: "system", content: "You are a friendly AI assistant." },
          { role: "user", content: query },
        ],
      }),
    });

    const data = await openaiResp.json();

    // Extract AI reply text
    const reply = data.choices?.[0]?.message?.content || "No response.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ reply: "⚠️ Backend error." });
  }
}
