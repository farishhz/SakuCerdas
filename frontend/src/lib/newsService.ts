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
      if (!API_KEY) {
        throw new Error('API Key GNews belum dikonfigurasi di Environment Variable (VITE_GNEWS_API_KEY).');
      }

      // Broad query for more diverse financial results
      const query = 'ekonomi OR investasi OR "perencanaan keuangan" OR "pasar modal" OR "berita bisnis" OR "saham" OR "reksadana"';
      const url = `${BASE_URL}/search?q=${encodeURIComponent(query)}&lang=id&country=id&max=${max}&apikey=${API_KEY}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('API Key GNews tidak valid atau limit harian sudah tercapai.');
        }
        throw new Error(`Gagal mengambil berita (Status: ${response.status})`);
      }
      
      const data = await response.json();
      return data.articles || [];
    } catch (error) {
      console.error('News fetch error:', error);
      return [];
    }
  },

  async getLatestOne(): Promise<NewsArticle | null> {
    const news = await this.getFinancialNews(1);
    return news.length > 0 ? news[0] : null;
  }
};
