const SERVER_URL = import.meta.env.VITE_SERVER_URL;

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
      const url = `${SERVER_URL}/news?max=${max}&lang=id`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
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
