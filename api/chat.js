export default async function handler(req, res) {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: "No query provided" });
  }

  try {
    const aiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.1-nano", // your chosen model
        messages: [{
          role: "system",
          content: "You are an expert educator. Explain things clearly for students."
        },{
          role: "user",
          content: query
        }],
        max_tokens: 350,
        temperature: 0.6
      })
    });

    const aiData = await aiResp.json();

    return res.status(200).json({
      ai_response: aiData
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
      }
