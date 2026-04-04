import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';
import { newsService } from '../lib/newsService';
import type { NewsArticle } from '../lib/newsService';

const FinancialLiteracy = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await newsService.getFinancialNews(40);
        setNews(data);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat berita.');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="animate-enter pb-8">
      <div className="top-header">
        <div>
          <div className="header-badge"><Newspaper size={12} /> Literasi Keuangan</div>
          <h1>Wawasan & Berita</h1>
          <p>Update tren ekonomi dan strategi investasi terbaru untukmu.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <div className="spin-icon" style={{ width: '40px', height: '40px', border: '3px solid rgba(139,92,246,0.1)', borderTopColor: 'var(--purple)', borderRadius: '50%', margin: '0 auto' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Mencari berita terbaru...</p>
        </div>
      ) : error || news.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📡</div>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{error || 'Berita gagal dimuat'}</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {error ? 'Silakan cek apakah API Key GNews sudah diset di Vercel Dashboard.' : 'Pastikan koneksi internet stabil atau coba lagi nanti.'}
          </p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Coba Lagi</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {news.map((item, idx) => (
            <div key={idx} className="glass-card news-card-interactive" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0 }}>
              {item.image && (
                <div style={{ height: '180px', overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} />
                </div>
              )}
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="tag tag-default" style={{ fontSize: '0.65rem' }}>{item.source.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                    <Clock size={10} />
                    {new Date(item.publishedAt).toLocaleDateString('id-ID')}
                  </div>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, lineHeight: 1.4, marginBottom: '0.75rem', color: 'var(--text)' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                  {item.description}
                </p>
                <div style={{ marginTop: 'auto' }}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', border: '1px solid var(--border)' }}>
                    Baca Selengkapnya <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinancialLiteracy;
