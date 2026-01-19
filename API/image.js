// /api/image.js
export default async function handler(req, res) {
  try {
    // Get your Pixabay API key from environment variable
    const PIXABAY_KEY = process.env.PIXABAY_KEY;
    if (!PIXABAY_KEY) {
      return res.status(500).json({ error: "Pixabay API key not set" });
    }

    // Optionally, get a query from request for specific images
    const query = req.body?.query || "technology";

    // Pixabay API URL
    const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=50&safesearch=true`;

    const response = await fetch(url);
    const data = await response.json();

    // Format images array for frontend
    const images = data.hits.map(hit => ({
      url: hit.largeImageURL,
      description: hit.tags || "Pixabay image"
    }));

    res.status(200).json({ images });
  } catch (err) {
    console.error("Pixabay API Error:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
}
