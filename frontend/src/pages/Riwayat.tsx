import { useState } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const transactions = [
  { id: 1, date: '25 Okt', desc: 'Gaji Bulanan', cat: 'Gaji', amount: 8000000, type: 'in' },
  { id: 2, date: '26 Okt', desc: 'Kopi Kenangan', cat: 'F&B', amount: 35000, type: 'out' },
  { id: 3, date: '28 Okt', desc: 'Reksadana Saham', cat: 'Investasi', amount: 1000000, type: 'out' },
  { id: 4, date: '30 Okt', desc: 'Cashback Ayo', cat: 'Lainnya', amount: 50000, type: 'in' },
  { id: 5, date: '01 Nov', desc: 'Netflix Premium', cat: 'Hiburan', amount: 153000, type: 'out' },
];

const pieData = [
  { name: 'Investasi', value: 1000000 },
  { name: 'F&B', value: 35000 },
  { name: 'Hiburan', value: 153000 },
];
const COLORS = ['#FFFFFF', '#888888', '#444444'];

const trendData = [
  { bln: 'Mei', masuk: 7500000, keluar: 980000 },
  { bln: 'Jun', masuk: 7500000, keluar: 1200000 },
  { bln: 'Jul', masuk: 8000000, keluar: 1050000 },
  { bln: 'Agu', masuk: 8000000, keluar: 900000 },
  { bln: 'Sep', masuk: 7800000, keluar: 1300000 },
  { bln: 'Okt', masuk: 8050000, keluar: 1188000 },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }> }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem 1rem', fontSize: '0.82rem' }}>
        {payload.map((p) => (
          <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>
            {p.name}: Rp{(+p.value).toLocaleString('id-ID')}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Riwayat = () => {
  const [tab, setTab] = useState<'list' | 'chart'>('list');
  const totalIn = transactions.filter(t => t.type === 'in').reduce((a, t) => a + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'out').reduce((a, t) => a + t.amount, 0);

  return (
    <div className="animate-enter pb-8">
      <div className="top-header">
        <div>
          <div className="header-badge">Catatan Keuangan</div>
          <h1>Riwayat Transaksi</h1>
          <p>Pantau arus kas dan analisis pengeluaranmu.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '0.25rem' }}>
          <button onClick={() => setTab('list')} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 600, background: tab === 'list' ? 'white' : 'transparent', color: tab === 'list' ? '#080808' : 'var(--text-muted)', transition: 'all 0.2s' }}>List</button>
          <button onClick={() => setTab('chart')} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 600, background: tab === 'chart' ? 'white' : 'transparent', color: tab === 'chart' ? '#080808' : 'var(--text-muted)', transition: 'all 0.2s' }}>Analisis</button>
        </div>
      </div>

      {/* Summary */}
      <div className="dashboard-grid">
        <div className="glass-card">
          <div className="card-header">
            <div className="card-icon bg-success"><ArrowDownRight size={18} /></div>
            <div><div className="card-title">Total Masuk</div><div className="card-value text-success">+Rp{totalIn.toLocaleString('id-ID')}</div></div>
          </div>
        </div>
        <div className="glass-card">
          <div className="card-header">
            <div className="card-icon bg-danger"><ArrowUpRight size={18} /></div>
            <div><div className="card-title">Total Keluar</div><div className="card-value text-danger">-Rp{totalOut.toLocaleString('id-ID')}</div></div>
          </div>
        </div>
      </div>

      {tab === 'list' && (
        <div className="glass-card">
          {transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Belum ada transaksi</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Mulai catat pengeluaran pertamamu di sini.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Keterangan</th>
                  <th>Kategori</th>
                  <th>Tanggal</th>
                  <th style={{ textAlign: 'right' }}>Nominal</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className={`icon-box ${t.type === 'in' ? 'bg-success' : 'bg-danger'}`}>
                          {t.type === 'in' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.desc}</span>
                      </div>
                    </td>
                    <td><span className="tag tag-default">{t.cat}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{t.date}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: t.type === 'in' ? 'var(--success)' : 'var(--danger)', fontFamily: 'var(--font-mono)' }}>
                      {t.type === 'in' ? '+' : '-'}Rp{t.amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'chart' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {/* Donut */}
          <div className="glass-card">
            <div style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.95rem' }}>Distribusi Pengeluaran</div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} stroke="none" />)}
                </Pie>
                <Tooltip formatter={(v) => [`Rp${Number(v).toLocaleString('id-ID')}`]} contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
              {pieData.map((d, i) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i] }} />
                  {d.name}
                </div>
              ))}
            </div>
          </div>

          {/* Line Chart */}
          <div className="glass-card">
            <div style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.95rem' }}>Tren 6 Bulan</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="bln" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000000}Jt`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.75rem', color: '#666' }} />
                <Line type="monotone" dataKey="masuk" stroke="#22C55E" strokeWidth={2} dot={false} name="Masuk" />
                <Line type="monotone" dataKey="keluar" stroke="#EF4444" strokeWidth={2} dot={false} name="Keluar" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
export default Riwayat;
