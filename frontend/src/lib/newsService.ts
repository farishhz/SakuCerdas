const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const BASE_URL = 'https://gnews.io/api/v4';

export interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export const newsService = {
  async getFinancialNews(max = 10): Promise<NewsArticle[]> {
    try {
      const isProd = import.meta.env.PROD;
      
      // Gunakan proxy /api/news saat di produksi (Vercel) untuk menghindari CORS.
      // Di lokal development, kita masih bisa tembak langsung ke GNews.
      let url = `${BASE_URL}/search?q=${encodeURIComponent('ekonomi OR investasi OR keuangan')}&lang=id&max=${max}&apikey=${API_KEY}`;
      
      if (isProd) {
        url = `/api/news?max=${max}&lang=id`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        // Jika di proxy, data.error akan berisi pesan dari news.js kita
        const errMsg = data.error || (data.errors ? data.errors[0] : `Gagal mengambil berita (Status: ${response.status})`);
        throw new Error(errMsg);
      }
      
      return data.articles || [];
    } catch (error) {
      console.error('News fetch error:', error);
      throw error;
    }
  },

  async getLatestOne(): Promise<NewsArticle | null> {
    const news = await this.getFinancialNews(1);
    return news.length > 0 ? news[0] : null;
  }
};
