export default async function handler(req, res) {
  // Hanya izinkan method GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { max = 10, lang = 'id' } = req.query;
  const API_KEY = process.env.VITE_GNEWS_API_KEY; 
  const BASE_URL = 'https://gnews.io/api/v4';
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'GNews API Key belum dikonfigurasi di Vercel Dashboard.' });
  }

  // Sederhanakan query agar hasil lebih banyak dan relevan
  const query = 'ekonomi OR investasi OR keuangan';
  const url = `${BASE_URL}/search?q=${encodeURIComponent(query)}&lang=${lang}&max=${max}&apikey=${API_KEY}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({
        error: data.errors ? data.errors[0] : 'Gagal mengambil berita dari GNews',
        status: response.status
      });
    }
    
    // Set cache header agar tidak terlalu sering membebani API (Limit GNews Free rendah)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
