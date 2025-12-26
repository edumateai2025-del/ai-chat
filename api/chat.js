// /api/chat.js
export default async function handler(req, res) {
  const query = req.query.q;
  const mode = req.query.mode || "educator";

  if (!query) {
    return res.status(400).json({ reply: "No query provided" });
  }

  try {
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-nano",
        messages: [
          { role: "system", content: `You are an AI ${mode} tutor.` },
          { role: "user", content: query }
        ],
        max_tokens: 500
      })
    });

    const data = await openaiResp.json();

    // Check the response format carefully
    const reply = data.choices?.[0]?.message?.content || "Sorry, no response";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("Backend error:", err);
    return res.status(500).json({ reply: "⚠️ Server error — check backend" });
  }
      }
