import { useState } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';

const DanaDarurat = () => {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [married, setMarried] = useState('single');
  const [tanggungan, setTanggungan] = useState(0);
  const [pengeluaran, setPengeluaran] = useState(3000000);
  const [result, setResult] = useState({ multiplier: 0, amount: 0 });

  const hitung = () => {
    let multiplier = 3;
    if (married === 'married') multiplier += 3;
    multiplier += tanggungan;
    multiplier = Math.min(multiplier, 12);
    setResult({ multiplier, amount: pengeluaran * multiplier });
    setStep('result');
  };

  const fmt = (v: number) => `Rp${v.toLocaleString('id-ID')}`;

  return (
    <div className="animate-enter pb-8">
      <div className="top-header">
        <div>
          <div className="header-badge"><ShieldCheck size={12} /> Perencanaan</div>
          <h1>Dana Darurat</h1>
          <p>Hitung kebutuhan dana darurat ideal berdasarkan kondisimu.</p>
        </div>
      </div>

      {step === 'form' && (
        <div style={{ maxWidth: '520px' }}>
          <div className="glass-card" style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.95rem' }}>📋 Profil Keuanganmu</div>

            <div className="input-group">
              <label className="input-label">Status Pernikahan</label>
              <div className="input-wrapper">
                <select className="input-field" value={married} onChange={e => setMarried(e.target.value)}>
                  <option value="single">Lajang / Single</option>
                  <option value="married">Sudah Menikah</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Jumlah Tanggungan (Anak/Orang Tua)</label>
              <div className="input-wrapper">
                <select className="input-field" value={tanggungan} onChange={e => setTanggungan(+e.target.value)}>
                  {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n} orang</option>)}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Pengeluaran Rutin / Bulan (Rp)</label>
              <div className="input-wrapper">
                <input type="number" className="input-field" value={pengeluaran} onChange={e => setPengeluaran(+e.target.value)} />
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={hitung}>
              Hitung Dana Darurat <ArrowRight size={15} />
            </button>
          </div>

          <div className="glass-card" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.88rem' }}>ℹ️ Cara Menghitung</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.75 }}>
              <div>• Single: <strong style={{ color: 'var(--text)' }}>3 bulan</strong> pengeluaran</div>
              <div>• Menikah: <strong style={{ color: 'var(--text)' }}>+3 bulan</strong> tambahan</div>
              <div>• Setiap tanggungan: <strong style={{ color: 'var(--text)' }}>+1 bulan</strong> tambahan</div>
              <div>• Maksimal: <strong style={{ color: 'var(--text)' }}>12 bulan</strong> pengeluaran</div>
            </div>
          </div>
        </div>
      )}

      {step === 'result' && (
        <div style={{ maxWidth: '520px' }}>
          <div className="glass-card" style={{ marginBottom: '1rem', borderColor: 'rgba(34,197,94,0.25)', textAlign: 'center' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="card-icon bg-success" style={{ margin: '0 auto 1rem', width: '3.5rem', height: '3.5rem' }}><CheckCircle size={22} /></div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>Dana Darurat Ideal</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--success)' }}>{fmt(result.amount)}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.5rem' }}>
                Setara <strong style={{ color: 'var(--text)' }}>{result.multiplier}×</strong> pengeluaran bulananmu
              </div>
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep('form')}>← Hitung Ulang</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => alert('Target dana darurat berhasil dibuat!')}>
                Jadikan Target Impian
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DanaDarurat;
