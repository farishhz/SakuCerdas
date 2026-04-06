import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock, TrendingUp, Activity } from 'lucide-react';
import { newsService } from '../lib/newsService';
import type { NewsArticle } from '../lib/newsService';
import { bffService } from '../lib/services';

const FinancialLiteracy = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Ambil data kesehatan finansial (BFF) dan Berita secara paralel
        const [hResult, nData] = await Promise.all([
          bffService.getFinancialHealth(),
          newsService.getFinancialNews(40)
        ]);

        setHealthData(hResult.data);
        setNews(nData);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

      {healthData && (
        <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
          <div className="glass-card" style={{ background: 'var(--accent-grad)', color: 'white', border: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.85rem', opacity: 0.9, fontWeight: 600 }}>Skor Kesehatan Finansial</div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.25rem' }}>{healthData.score}/100</h2>
              </div>
              <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={24} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <span className="tag" style={{ background: 'white', color: 'var(--purple)', border: 'none' }}>Status: {healthData.status}</span>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', lineHeight: 1.5, opacity: 0.95 }}>
              💡 {healthData.recommendation}
            </p>
          </div>

          <div className="glass-card">
            <div style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={16} className="text-purple" /> Metrik Utama
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  <span className="text-muted">Savings Rate</span>
                  <span style={{ fontWeight: 700 }}>{healthData.metrics.savingsRate}%</span>
                </div>
                <div className="progress-container">
                  <div className="progress-fill" style={{ width: `${Math.max(0, healthData.metrics.savingsRate)}%` }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ flex: 1 }}>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sisa Hutang</div>
                   <div style={{ fontWeight: 700 }}>Rp{healthData.metrics.unpaidDebts.toLocaleString('id-ID')}</div>
                 </div>
                 <div style={{ flex: 1 }}>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pemasukan</div>
                   <div style={{ fontWeight: 700 }}>Rp{healthData.metrics.totalIncome.toLocaleString('id-ID')}</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
          {news.map((item: any, idx: number) => (
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
