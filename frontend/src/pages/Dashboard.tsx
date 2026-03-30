import { useState } from 'react';
import { Wallet, Target, Zap, ArrowUpRight, ArrowDownRight, PiggyBank } from 'lucide-react';

const stats = [
  { label: 'Total Saldo', value: 'Rp3.500.000', icon: Wallet, change: '+12%', up: true },
  { label: 'Pemasukan Bulan Ini', value: 'Rp8.000.000', icon: ArrowDownRight, change: '+0%', up: true },
  { label: 'Pengeluaran Bulan Ini', value: 'Rp1.188.000', icon: ArrowUpRight, change: '-5%', up: false },
];

const budgetAlerts = [
  { cat: 'Kopi & Minuman', used: 85, limit: 500000, spent: 426000 },
  { cat: 'Hiburan', used: 102, limit: 200000, spent: 204000 },
];

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [nabungAmt, setNabungAmt] = useState(250000);

  return (
    <div className="animate-enter pb-8">
      <div className="top-header">
        <div>
          <div className="header-badge"><Zap size={12} /> Overview</div>
          <h1>Halo, John! 👋</h1>
          <p>Ringkasan keuangan kamu per hari ini.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Zap size={15} fill="currentColor" /> Nabung Kilat
        </button>
      </div>

      {/* Stats */}
      <div className="dashboard-grid">
        {stats.map((s) => (
          <div key={s.label} className="glass-card">
            <div className="card-header" style={{ marginBottom: '1rem' }}>
              <div className="card-icon bg-dim"><s.icon size={18} /></div>
              <div style={{ flex: 1 }}>
                <div className="card-title">{s.label}</div>
              </div>
              <span className="tag" style={{ background: s.up ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: s.up ? '#22C55E' : '#EF4444' }}>{s.change}</span>
            </div>
            <div className="card-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Target Terdekat */}
      <div className="glass-card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div className="card-title">Target Terdekat</div>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '0.2rem' }}>Beli IEM Baru</h3>
          </div>
          <div className="card-icon bg-dim"><Target size={18} /></div>
        </div>
        <div className="progress-header">
          <span className="text-muted" style={{ fontSize: '0.82rem' }}>Rp400.000 / Rp500.000</span>
          <span style={{ fontWeight: 700 }}>80%</span>
        </div>
        <div className="progress-container">
          <div className="progress-fill success" style={{ width: '80%' }} />
        </div>
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <div className="glass-card" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div className="card-icon bg-danger"><PiggyBank size={16} /></div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Peringatan Budget!</div>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>Beberapa kategori mendekati atau melebihi limit.</div>
            </div>
          </div>
          {budgetAlerts.map((b) => (
            <div key={b.cat} style={{ marginBottom: '0.875rem' }}>
              <div className="progress-header">
                <span style={{ fontSize: '0.82rem' }}>{b.cat}</span>
                <span className={b.used > 100 ? 'text-danger' : 'text-warning'} style={{ fontWeight: 700 }}>{b.used}%</span>
              </div>
              <div className="progress-container">
                <div className={`progress-fill ${b.used > 100 ? 'danger' : 'warning'}`} style={{ width: `${Math.min(b.used, 100)}%` }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Rp{b.spent.toLocaleString('id-ID')} / Rp{b.limit.toLocaleString('id-ID')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nabung Kilat Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-title">⚡ Nabung Kilat</div>
            <div className="modal-desc">Saran aman berdasarkan sisa saldo & kebutuhan kamu sampai akhir bulan.</div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.4rem' }}>SARAN NOMINAL AMAN</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em' }}>Rp250.000</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Sisa saldo Rp3.250.000 cukup untuk kebutuhan bulan ini ✓</div>
            </div>
            <div className="input-group">
              <label className="input-label">Nominal Nabung (Rp)</label>
              <div className="input-wrapper">
                <input type="number" className="input-field" value={nabungAmt} onChange={e => setNabungAmt(+e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setModalOpen(false)}>Batal</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { alert(`Nabung Rp${nabungAmt.toLocaleString('id-ID')} berhasil!`); setModalOpen(false); }}>Nabung Sekarang</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;
