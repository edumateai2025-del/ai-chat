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
    /* 1️⃣ OpenAI response */
    const openaiResp = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
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
      }
    );

    const aiData = await openaiResp.json();
    const reply =
      aiData.choices?.[0]?.message?.content || "No response.";

    /* 2️⃣ Pixabay image search */
    const pixabayResp = await fetch(
      `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(
        message
      )}&image_type=photo&safesearch=true&per_page=3`
    );

    const pixabayData = await pixabayResp.json();

    const images =
      pixabayData.hits?.map((img) => ({
        id: img.id,
        thumbnail: img.webformatURL, // small (good for scroll)
        full: img.largeImageURL, // full image on click
        width: img.webformatWidth,
        height: img.webformatHeight,
      })) || [];

    /* 3️⃣ Send combined response */
    res.status(200).json({
      reply,
      images,
    });
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({
      reply: "⚠️ Something went wrong. Please try again later.",
      images: [],
    });
  }
  }
