import { useState } from 'react';
import { PiggyBank, Plus, AlertTriangle, CheckCircle } from 'lucide-react';

type Category = { id: number; name: string; limit: number; spent: number };

const initCats: Category[] = [
  { id: 1, name: 'Makan & Minum', limit: 1500000, spent: 980000 },
  { id: 2, name: 'Kopi & Minuman', limit: 500000, spent: 426000 },
  { id: 3, name: 'Hiburan', limit: 200000, spent: 204000 },
  { id: 4, name: 'Transport', limit: 400000, spent: 150000 },
];

const Budget = () => {
  const [cats, setCats] = useState<Category[]>(initCats);
  const [modal, setModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLimit, setNewLimit] = useState(500000);

  const pct = (c: Category) => Math.round((c.spent / c.limit) * 100);
  const status = (p: number) => p > 100 ? 'danger' : p >= 80 ? 'warning' : 'success';
  const statusText = (p: number) => p > 100 ? 'Overbudget' : p >= 80 ? 'Hampir Habis' : 'Aman';

  const handleCreate = () => {
    if (!newName || newLimit <= 0) return;
    setCats(cs => [...cs, { id: Date.now(), name: newName, limit: newLimit, spent: 0 }]);
    setNewName(''); setNewLimit(500000); setModal(false);
  };

  return (
    <div className="animate-enter pb-8">
      <div className="top-header">
        <div>
          <div className="header-badge"><PiggyBank size={12} /> Manajemen Budget</div>
          <h1>Budget Kategori</h1>
          <p>Atur batas pengeluaran per kategori agar keuangan tetap sehat.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>
          <Plus size={15} /> Tambah Kategori
        </button>
      </div>

      {/* Overview */}
      <div className="dashboard-grid">
        <div className="glass-card">
          <div className="card-title">Total Budget</div>
          <div className="card-value">Rp{cats.reduce((a, c) => a + c.limit, 0).toLocaleString('id-ID')}</div>
        </div>
        <div className="glass-card">
          <div className="card-title">Total Terpakai</div>
          <div className="card-value">Rp{cats.reduce((a, c) => a + c.spent, 0).toLocaleString('id-ID')}</div>
        </div>
        <div className="glass-card">
          <div className="card-title">Kategori Overbudget</div>
          <div className="card-value text-danger">{cats.filter(c => pct(c) > 100).length} Kategori</div>
        </div>
      </div>

      {cats.map(c => {
        const p = pct(c);
        const st = status(p);
        return (
          <div key={c.id} className="glass-card" style={{ marginBottom: '0.75rem', borderColor: st === 'danger' ? 'rgba(239,68,68,0.2)' : st === 'warning' ? 'rgba(245,158,11,0.2)' : 'var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className={`icon-box bg-${st}`}>
                  {st === 'danger' ? <AlertTriangle size={14} /> : st === 'warning' ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{c.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Rp{c.spent.toLocaleString('id-ID')} / Rp{c.limit.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
              <span className={`tag tag-${st}`}>{statusText(p)}</span>
            </div>
            <div className="progress-header">
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Penggunaan Budget</span>
              <span style={{ fontWeight: 700 }} className={st === 'danger' ? 'text-danger' : st === 'warning' ? 'text-warning' : 'text-success'}>{p}%</span>
            </div>
            <div className="progress-container">
              <div className={`progress-fill ${st}`} style={{ width: `${Math.min(p, 100)}%` }} />
            </div>
          </div>
        );
      })}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Tambah Kategori Budget</div>
            <div className="modal-desc">Tentukan nama kategori dan batas maksimal pengeluaran per bulan.</div>
            <div className="input-group">
              <label className="input-label">Nama Kategori</label>
              <div className="input-wrapper"><input type="text" className="input-field" placeholder="e.g. Bensin" value={newName} onChange={e => setNewName(e.target.value)} /></div>
            </div>
            <div className="input-group">
              <label className="input-label">Batas Budget / Bulan (Rp)</label>
              <div className="input-wrapper"><input type="number" className="input-field" value={newLimit} onChange={e => setNewLimit(+e.target.value)} /></div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setModal(false)}>Batal</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleCreate}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Budget;
