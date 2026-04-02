import { useState, useEffect } from 'react';
import { Activity, Shield, TrendingUp, AlertTriangle, CheckCircle2, Heart, Zap, Sparkles } from 'lucide-react';
import { healthService } from '../lib/services';

const FinancialHealth = () => {
  const [data, setData] = useState<any>({ score: 0, savingsRate: 0, unpaidDebts: 0 });
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const res = await healthService.getScore();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  if (loading) return (
    <div className="animate-enter pb-8">
      <div className="top-header">
        <div>
          <div className="header-badge"><Activity size={12} /> Audit Finansial</div>
          <h1>Memuat Skor...</h1>
          <p>Harap tunggu sebentar, kami sedang menganalisis kesehatan keuanganmu.</p>
        </div>
      </div>
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(139,92,246,0.2)', borderTopColor: 'var(--purple)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
      </div>
    </div>
  );

  const score = data?.score || 0;
  
  const getScoreColor = (s: number) => {
    if (s >= 80) return '#22C55E';
    if (s >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const color = getScoreColor(score);

  return (
    <div className="animate-enter pb-8">
      <div className="top-header">
        <div>
          <div className="header-badge"><Activity size={12} /> Audit Finansial</div>
          <h1>Kesehatan Keuangan</h1>
          <p>Berdasarkan data keuanganmu bulan ini, inilah kondisi finansialmu.</p>
        </div>
        <button className="btn btn-ghost" onClick={fetchHealth}><Zap size={16} /> Re-Audit</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        
        {/* Score Card */}
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 2rem' }}>
             <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="8" strokeDasharray={`${score * 2.82} 282`} strokeLinecap="round" style={{ transition: 'all 1s ease-out' }} />
             </svg>
             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white' }}>{score}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Financial Score</div>
             </div>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
             {score >= 80 ? 'Sangat Sehat! 🚀' : score >= 60 ? 'Perlu Waspada! ⚠️' : 'Darurat Finansial! 🚨'}
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
             Skor kamu berada di atas rata-rata pengguna SakuCerdas lainnya. Teruskan!
          </p>
        </div>

        {/* Breakdown & Analysis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-card">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
               <div className="card-icon bg-success-dim"><Shield size={18} /></div>
               <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>Rasio Tabungan</div>
                  <div className="progress-container" style={{ margin: '0.5rem 0' }}>
                     <div className="progress-fill success" style={{ width: `${Math.min(data?.savingsRate || 0, 100)}%` }} />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {data?.savingsRate || 0}% dari pemasukan kamu berhasil ditabung. Idealnya {'>'}20%.
                  </div>
               </div>
            </div>
          </div>

          <div className="glass-card">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
               <div className="card-icon bg-danger-dim"><TrendingUp size={18} /></div>
               <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>Beban Hutang</div>
                  <div className="progress-container" style={{ margin: '0.5rem 0' }}>
                     <div className="progress-fill danger" style={{ width: (data?.unpaidDebts || 0) > 0 ? '40%' : '0%' }} />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Total hutang lunas: Rp{(data?.unpaidDebts || 0).toLocaleString('id-ID')}. Pastikan {'<'}30% pendapatan.
                  </div>
               </div>
            </div>
          </div>

          <div className="glass-card" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
               <div className="card-icon"><Sparkles size={18} className="text-primary" /></div>
               <h3 style={{ fontWeight: 700 }}>Saran Otomatis (AI)</h3>
            </div>
            <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
               <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.88rem' }}>
                  <CheckCircle2 size={16} className="text-success" style={{ flexShrink: 0 }} />
                  <span>{score >= 80 ? 'Pertahankan gaya hidup hematmu, mulailah alokasikan lebih banyak ke investasi.' : 'Kurangi pengeluaran keinginan (wants) untuk menaikkan tabungan.'}</span>
               </li>
               <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.88rem' }}>
                  <AlertTriangle size={16} className={(data?.unpaidDebts || 0) > 0 ? 'text-warning' : 'text-success'} style={{ flexShrink: 0 }} />
                  <span>{(data?.unpaidDebts || 0) > 0 ? 'Segera lunasi hutang kecil untuk mengurangi beban bunga mental.' : 'Hebat! Kamu bebas dari hutang konsumtif bulan ini.'}</span>
               </li>
               <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.88rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                  <Heart size={16} className="text-danger" style={{ flexShrink: 0 }} />
                  <span>Jangan lupa alokasikan dana Zakat Maal jika saldo sudah mencapai nisab.</span>
               </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialHealth;
