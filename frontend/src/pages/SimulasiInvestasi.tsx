import { useState } from 'react';
import { TrendingUp, Calculator } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import CurrencyInput from '../components/CurrencyInput';

const calcCompound = (modal: number, monthly: number, rate: number, years: number) => {
  const monthlyRate = rate / 100 / 12;
  return Array.from({ length: years * 12 }, (_, i) => {
    const nabung = modal + monthly * i;
    const invest = modal * Math.pow(1 + monthlyRate, i + 1) + monthly * ((Math.pow(1 + monthlyRate, i + 1) - 1) / monthlyRate);
    return { bln: i + 1, Nabung: Math.round(nabung), Investasi: Math.round(invest) };
  }).filter((_, i) => i % 12 === 11);
};

const SimulasiInvestasi = () => {
  const [modal, setModal] = useState(5000000);
  const [monthly, setMonthly] = useState(1000000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [data, setData] = useState(() => calcCompound(5000000, 1000000, 12, 10));
  const [result, setResult] = useState({ nabung: 0, invest: 0 });

  const hitung = () => {
    const d = calcCompound(modal, monthly, rate, years);
    setData(d);
    const last = d[d.length - 1];
    setResult({ nabung: last.Nabung, invest: last.Investasi });
  };

  const fmt = (v: number) => v >= 1e9 ? `Rp${(v/1e9).toFixed(1)}M` : v >= 1e6 ? `Rp${(v/1e6).toFixed(1)}Jt` : `Rp${v.toLocaleString('id-ID')}`;

  return (
    <div className="animate-enter pb-8">
      <div className="top-header">
        <div>
          <div className="header-badge"><TrendingUp size={12} /> Proyeksi Dana</div>
          <h1>Simulasi Investasi</h1>
          <p>Lihat keajaiban efek bunga majemuk (Compound Interest).</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div className="card-icon bg-dim"><Calculator size={16} /></div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Parameter Skenario</div>
          </div>
          {[
            { label: 'Modal Awal (Rp)', val: modal, set: setModal, isCurrency: true },
            { label: 'Tabungan Rutin / Bulan (Rp)', val: monthly, set: setMonthly, isCurrency: true },
            { label: 'Return / Tahun (%)', val: rate, set: setRate, isCurrency: false },
            { label: 'Durasi (Tahun)', val: years, set: setYears, isCurrency: false },
          ].map(({ label, val, set, isCurrency }) => (
            <div className="input-group" key={label}>
              <label className="input-label">{label}</label>
              <div className="input-wrapper">
                {isCurrency ? (
                  <CurrencyInput className="input-field" value={val} onChange={(num) => set(num as number)} />
                ) : (
                  <input type="number" className="input-field" value={val} onChange={e => set(+e.target.value)} />
                )}
              </div>
            </div>
          ))}
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={hitung}>
            Hitung Proyeksi
          </button>
        </div>

        {result.invest > 0 && (
          <div className="glass-card">
            <div style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '0.95rem' }}>📊 Hasil Proyeksi {years} Tahun</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1rem' }}>
                <div className="card-title">Jika Hanya Nabung Biasa</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>{fmt(result.nabung)}</div>
              </div>
              <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '0.75rem', padding: '1rem' }}>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--success)', fontWeight: 600, marginBottom: '0.25rem' }}>Jika Diinvestasikan</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>{fmt(result.invest)}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>+{fmt(result.invest - result.nabung)} lebih banyak!</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {data.length > 0 && result.invest > 0 && (
        <div className="glass-card">
          <div style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.95rem' }}>Grafik Pertumbuhan</div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ left: -10 }}>
              <defs>
                <linearGradient id="gNabung" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#888" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#888" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gInvestasi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="bln" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `Thn ${v/12}`} />
              <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000000}Jt`} />
              <Tooltip formatter={(v) => [`Rp${Number(v).toLocaleString('id-ID')}`]} contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', fontSize: '0.8rem' }} />
              <Area type="monotone" dataKey="Nabung" stroke="#666" strokeWidth={1.5} fill="url(#gNabung)" dot={false} />
              <Area type="monotone" dataKey="Investasi" stroke="#22C55E" strokeWidth={2} fill="url(#gInvestasi)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
export default SimulasiInvestasi;
