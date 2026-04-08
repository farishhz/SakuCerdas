import { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';
import { bffService } from '../lib/services';
import CurrencyInput from '../components/CurrencyInput';
import { useToast } from '../context/ToastContext';

const DanaDarurat = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'form' | 'result'>('form');
  
  const [married, setMarried] = useState('single');
  const [tanggungan, setTanggungan] = useState(0);
  const [pengeluaran, setPengeluaran] = useState(3000000);
  const [result, setResult] = useState({ multiplier: 0, amount: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await bffService.getEmergencyFund();
        const data = res.data;

        if (data) {
          setMarried(data.marital_status);
          setTanggungan(data.dependants);
          setPengeluaran(data.monthly_expenses);
          setResult({
            multiplier: data.multiplier,
            amount: data.target_amount
          });
          setStep('result');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExisting();
  }, []);

  const hitung = async () => {
    let multiplier = 3;
    if (married === 'married') multiplier += 3;
    multiplier += tanggungan;
    multiplier = Math.min(multiplier, 12);
    
    const amount = pengeluaran * multiplier;
    setResult({ multiplier, amount });

    try {
      setSaving(true);
      const payload = {
        marital_status: married,
        dependants: tanggungan,
        monthly_expenses: pengeluaran,
        multiplier,
        target_amount: amount
      };
      
      await bffService.saveEmergencyFund(payload);
      setStep('result');
      showToast('Dana darurat diperbarui!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal menyimpan perhitungan', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateTarget = async () => {
    if (result.amount <= 0) return;
    try {
      setSaving(true);
      await bffService.createTarget({ name: 'Dana Darurat', target_amount: result.amount });
      showToast('Target Dana Darurat berhasil dibuat!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal membuat Target Impian', 'error');
    } finally {
      setSaving(false);
    }
  };

  const fmt = (v: number) => `Rp${v.toLocaleString('id-ID')}`;

  if (loading) {
    return (
      <div className="animate-enter pb-8">
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Memuat data kalkulasi...</div>
      </div>
    );
  }

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
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
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
                <CurrencyInput className="input-field" value={pengeluaran as number} onChange={(val) => setPengeluaran(val as number || 0)} />
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={hitung} disabled={saving}>
              {saving ? 'Menyimpan...' : <>Hitung Dana Darurat <ArrowRight size={15} /></>}
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
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
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
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleCreateTarget} disabled={saving}>
                {saving ? 'Memproses...' : 'Jadikan Target Impian'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DanaDarurat;
