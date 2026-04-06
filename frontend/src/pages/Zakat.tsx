import { useState, useEffect } from 'react';
import { Heart, Info, Calculator, ExternalLink, ShieldCheck } from 'lucide-react';
import { bffService } from '../lib/services';

const Zakat = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [goldPrice] = useState(1200000);
  const nisab = goldPrice * 85; 
  
  useEffect(() => {
    const getBal = async () => {
      try {
        const res = await bffService.getDashboardSummary();
        setBalance(res.data?.summary?.balance || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getBal();
  }, []);

  const isObligated = balance >= nisab;
  const zakatAmount = isObligated ? Math.round(balance * 0.025) : 0;

  return (
    <div className="animate-enter pb-8">
      <div className="top-header">
        <div>
          <div className="header-badge"><Heart size={12} /> <span>Ibadah & Sosial</span></div>
          <h1>Kalkulator Zakat Maal</h1>
          <p><span>Hitung kewajiban zakat harta Anda secara otomatis.</span></p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="card-icon bg-dim"><Calculator size={18} /></div>
            <h3 style={{ fontWeight: 700 }}><span>Total Harta (Saldo Saat Ini)</span></h3>
          </div>
          
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>
            {loading ? <span>...</span> : <span>Rp{(balance || 0).toLocaleString('id-ID')}</span>}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <span>Berdasarkan total saldo bersih di Dashboard SakuCerdas Anda.</span>
          </p>

          <div className="divider" style={{ margin: '2rem 0' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Ambang Batas (Nisab)</span> <Info size={14} />
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem' }}>
                <span>Rp{nisab.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                <span>Asumsi harga emas: Rp{(goldPrice/1000).toLocaleString('id-ID')}rb/gr</span>
              </div>
            </div>

            <div>
              <div className="card-title"><span>Status Kewajiban</span></div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', padding: '0.35rem 0.75rem', borderRadius: '2rem', background: isObligated ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)', color: isObligated ? 'var(--success)' : 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                {isObligated && <ShieldCheck size={14}/>}
                <span>{isObligated ? 'Wajib Zakat' : 'Belum Mencapai Nisab'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ background: isObligated ? 'var(--accent-grad)' : 'rgba(255,255,255,0.02)', border: isObligated ? 'none' : '1px solid var(--border)' }}>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: isObligated ? 'white' : 'var(--text-muted)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', opacity: 0.8 }}><span>Zakat yang Harus Ditunaikan</span></div>
            <div style={{ fontSize: '2.25rem', fontWeight: 900 }}>
              {loading ? <span>...</span> : <span>Rp{(zakatAmount || 0).toLocaleString('id-ID')}</span>}
            </div>
            {isObligated && (
              <p style={{ marginTop: '1rem', fontSize: '0.82rem', opacity: 0.9 }}>
                <span>2,5% dari total harta Anda.</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '1.5rem' }}>
        <h4 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Info size={16} className="text-primary" /> <span>Edukasi Zakat Maal</span>
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <strong style={{ color: 'var(--text)', marginBottom: '0.25rem' }}>Apa itu Zakat Maal?</strong>
            <span>Zakat yang dikenakan atas harta yang dimiliki oleh seseorang dengan syarat-syarat dan ketentuan-ketentuan yang telah ditetapkan secara syariat.</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <strong style={{ color: 'var(--text)', marginBottom: '0.25rem' }}>Syarat Wajib Zakat</strong>
            <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
              <li><span>1. Milik Penuh</span></li>
              <li><span>2. Mencapai Nisab (Setara 85gr Emas)</span></li>
              <li><span>3. Mencapai Haul (Kepemilikan 1 Tahun)</span></li>
            </ul>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn btn-ghost" style={{ justifyContent: 'center' }} onClick={() => window.open('https://baznas.go.id/zakatmaal', '_blank')}>
              <span>Baca Selengkapnya</span> <ExternalLink size={14} style={{ marginLeft: '0.5rem' }} />
            </button>
            <button className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={() => window.open('https://baznas.go.id/bayarzakat', '_blank')}>
              <span>Tunaikan Sekarang</span> <Heart size={14} style={{ marginLeft: '0.5rem' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Zakat;
