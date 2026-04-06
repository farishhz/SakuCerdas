let newsCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 60 * 1000;

export const getNews = async (req, res) => {
  try {
    const { max = 10, lang = 'id' } = req.query;
    const now = Date.now();

    if (newsCache && (now - cacheTimestamp < CACHE_DURATION)) {
      return res.status(200).json({ articles: newsCache });
    }

    const apiKey = process.env.GNEWS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: "GNEWS_API_KEY is missing in backend environment variables." 
      });
    }

    const query = encodeURIComponent('ekonomi OR investasi OR keuangan');
    const url = `https://gnews.io/api/v4/search?q=${query}&lang=${lang}&max=${max}&apikey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      const errMsg = data.errors ? data.errors[0] : `GNews API Error (Status: ${response.status})`;
      throw new Error(errMsg);
    }

    newsCache = data.articles || [];
    cacheTimestamp = now;

    res.status(200).json({ articles: newsCache });
  } catch (error) {
    console.error('News Controller Error:', error.message);
    
    if (newsCache) {
      return res.status(200).json({ 
        articles: newsCache, 
        note: "Serving stale cache due to upstream error." 
      });
    }
    
    res.status(500).json({ error: error.message });
  }
};
