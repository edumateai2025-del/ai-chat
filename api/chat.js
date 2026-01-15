// /api/chat.js
export default async function handler(req, res) {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ reply: "No question received.", images: [] });
  }

  try {
    // ===== OpenAI Chat Completion =====
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5-nano",
        messages: [
          { role: "system", content: "You are a friendly AI tutor that provides explanations and examples." },
          { role: "user", content: query },
        ],
      }),
    });

    const openaiData = await openaiResp.json();
    const reply = openaiData.choices?.[0]?.message?.content || "No response.";

    // ===== Pixabay Image Search =====
    const pixabayKey = process.env.PIXABAY_API_KEY; // Store your key in Vercel environment
    const pixabayURL = `https://pixabay.com/api/?key=${pixabayKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3&safesearch=true`;
    const pixabayResp = await fetch(pixabayURL);
    const pixabayData = await pixabayResp.json();

    // Map image URLs
    const images = (pixabayData.hits || []).map(hit => hit.webformatURL);

    res.status(200).json({ reply, images });

  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ reply: "⚠️ Backend error.", images: [] });
  }
}
