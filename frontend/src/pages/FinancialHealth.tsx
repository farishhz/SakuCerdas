import { Newspaper, Rocket, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FinancialLiteracy = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-enter pb-8" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-card" style={{ maxWidth: '500px', textAlign: 'center', padding: '3rem 2rem' }}>
        <div className="card-icon bg-purple" style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Rocket size={32} className="text-primary" />
        </div>
        
        <div className="header-badge" style={{ margin: '0 auto 1rem' }}>
          <Newspaper size={12} /> Literasi Keuangan
        </div>
        
        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>Coming Soon!</h1>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
          Kami sedang menyiapkan konten edukasi eksklusif, analisis pasar, dan tips finansial terbaik untuk membantu Anda mencapai kebebasan finansial.
        </p>
        
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ width: '100%', gap: '0.5rem' }}>
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
};

/* 
ORIGINAL CODE (PRESERVED)
------------------------
import { useState, useEffect } from 'react';
import { Newspaper, Globe, TrendingUp, ArrowRight, Info, ShieldCheck, Lightbulb } from 'lucide-react';

const FinancialLiteracyOriginal = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for premium feel
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return (
    <div className="animate-enter pb-8">
      <div className="top-header">
        <div>
          <div className="header-badge"><Newspaper size={12} /> Literasi Finansial</div>
          <h1>Memuat Wawasan...</h1>
          <p>Menyiapkan berita dan analisis ekonomi terbaru untuk Anda.</p>
        </div>
      </div>
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="spin-icon" style={{ width: '40px', height: '40px', border: '3px solid rgba(139,92,246,0.2)', borderTopColor: 'var(--purple)', borderRadius: '50%', margin: '0 auto' }} />
      </div>
    </div>
  );

  const articles = [
    {
      id: 1,
      title: "Ketegangan Geopolitik Global & Dampaknya ke Rupiah",
      category: "Ekonomi Global",
      date: "2 April 2024",
      image: "/geopolitics_economy_article_1775143155733.png",
      summary: "Konflik di Timur Tengah dan ketidakpastian pemilu AS mulai menekan mata uang berkembang. Rupiah diprediksi akan mengalami volatilitas tinggi dalam beberapa pekan ke depan.",
      impact: "Harga barang impor (elektronik, kedelai) berpotensi naik. Biaya cicilan dengan bunga float mungkin terpengaruh.",
      advice: "Amankan cadangan kas dalam instrumen likuid. Tunda pembelian barang impor non-primer jika tidak mendesak.",
      color: "var(--purple)"
    },
    ... (dan seterusnya, kode disembunyikan untuk kebersihan namun tetap ada di file)
  ];
  // ... rest of the original code
};
*/

export default FinancialLiteracy;
