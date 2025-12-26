export default async function handler(req, res) {
  const { q, mode } = req.query; // mode can be educator, researcher, friendly

  if (!q) {
    return res.status(400).json({ error: "No query provided" });
  }

  try {
    // Choose system prompt based on mode
    let systemPrompt = "";
    switch (mode) {
      case "researcher":
        systemPrompt = "You are a helpful researcher, very detailed and analytical.";
        break;
      case "friendly":
        systemPrompt = "You are a friendly tutor, explaining things in a simple and kind way.";
        break;
      case "educator":
      default:
        systemPrompt = "You are an AI educator, providing clear and concise explanations for students.";
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-nano",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: q }
        ],
        max_tokens: 500
      })
    });

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content || "No response";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Serverless error:", error);
    return res.status(500).json({ error: "Something went wrong", details: error.message });
  }
}
