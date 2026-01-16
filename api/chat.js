// /api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "No message received." });
  }

  try {
    /* ===== 1️⃣ ChatGPT Response ===== */
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5-nano",
        messages: [
          { role: "system", content: "You are a friendly AI tutor." },
          { role: "user", content: message },
        ],
      }),
    });

    const openaiData = await openaiResp.json();
    const reply = openaiData.choices?.[0]?.message?.content || "No response.";

    /* ===== 2️⃣ Pixabay Image Search ===== */
    const pixabayKey = process.env.PIXABAY_API_KEY;
    const pixabayUrl = `https://pixabay.com/api/?key=${pixabayKey}&q=${encodeURIComponent(message)}&image_type=photo&per_page=3&safesearch=true`;

    const pixabayResp = await fetch(pixabayUrl);
    const pixabayData = await pixabayResp.json();

    const images = (pixabayData.hits || []).map(hit => hit.webformatURL);

    /* ===== 3️⃣ Send Combined Response ===== */
    res.status(200).json({
      reply,
      images,
      suggestions: [] // optional: you can generate AI suggestions later
    });

  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ reply: "⚠️ Backend error.", images: [] });
  }
}
