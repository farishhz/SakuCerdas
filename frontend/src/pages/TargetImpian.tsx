import { useState } from 'react';
import { PlusCircle, Target, CheckCircle, Trash2 } from 'lucide-react';

const initTargets = [
  { id: 1, name: 'Beli IEM Baru', current: 400000, target: 500000 },
  { id: 2, name: 'Rakit Home Server', current: 1500000, target: 5000000 },
  { id: 3, name: 'Dana Darurat', current: 8000000, target: 10000000 },
];

const TargetImpian = () => {
  const [targets, setTargets] = useState(initTargets);
  const [modal, setModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selected, setSelected] = useState<null | typeof initTargets[0]>(null);
  const [addAmt, setAddAmt] = useState(50000);
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState(1000000);

  const pct = (t: typeof initTargets[0]) => Math.min(Math.round((t.current / t.target) * 100), 100);

  const openAdd = (t: typeof initTargets[0]) => { setSelected(t); setModal(true); };
  const handleAdd = () => {
    if (!selected) return;
    setTargets(ts => ts.map(t => t.id === selected.id ? { ...t, current: Math.min(t.current + addAmt, t.target) } : t));
    setModal(false);
  };
  const handleCreate = () => {
    if (!newName || newTarget <= 0) return;
    setTargets(ts => [...ts, { id: Date.now(), name: newName, current: 0, target: newTarget }]);
    setNewName(''); setNewTarget(1000000); setAddModal(false);
  };

  return (
    <div className="animate-enter pb-8">
      <div className="top-header">
        <div>
          <div className="header-badge"><Target size={12} /> {targets.length} Target Aktif</div>
          <h1>Target Impian</h1>
          <p>Pantau progres menuju impian finansialmu.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setAddModal(true)}>
          <PlusCircle size={15} /> Buat Target
        </button>
      </div>

      <div className="dashboard-grid">
        {targets.map(t => {
          const p = pct(t);
          const done = p >= 100;
          return (
            <div key={t.id} className="glass-card" style={done ? { borderColor: 'rgba(34,197,94,0.25)' } : {}}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <div className="card-title">Target</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '0.2rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Rp{t.current.toLocaleString('id-ID')} / Rp{t.target.toLocaleString('id-ID')}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {done && <div className="icon-box bg-success"><CheckCircle size={14} /></div>}
                  <div className="card-icon bg-dim" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <Target size={15} />
                  </div>
                </div>
              </div>
              <div className="progress-header">
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Progress</span>
                <span style={{ fontWeight: 700, color: done ? 'var(--success)' : 'var(--text)' }}>{p}%</span>
              </div>
              <div className="progress-container" style={{ marginBottom: '1.25rem' }}>
                <div className={`progress-fill ${done ? 'success' : ''}`} style={{ width: `${p}%` }} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.82rem', padding: '0.5rem' }} onClick={() => openAdd(t)}>
                  <PlusCircle size={14} /> Tambah
                </button>
                <button className="btn btn-danger" style={{ padding: '0.5rem 0.75rem' }} onClick={() => setTargets(ts => ts.filter(x => x.id !== t.id))}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add saldo modal */}
      {modal && selected && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Tambah Saldo</div>
            <div className="modal-desc">Target: <strong>{selected.name}</strong></div>
            <div className="input-group">
              <label className="input-label">Nominal (Rp)</label>
              <div className="input-wrapper"><input type="number" className="input-field" value={addAmt} onChange={e => setAddAmt(+e.target.value)} /></div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setModal(false)}>Batal</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAdd}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* Create target modal */}
      {addModal && (
        <div className="modal-overlay" onClick={() => setAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Buat Target Baru</div>
            <div className="modal-desc">Tentukan nama dan nominal target yang ingin dicapai.</div>
            <div className="input-group">
              <label className="input-label">Nama Target</label>
              <div className="input-wrapper"><input type="text" className="input-field" placeholder="e.g. Laptop Gaming" value={newName} onChange={e => setNewName(e.target.value)} /></div>
            </div>
            <div className="input-group">
              <label className="input-label">Nominal Target (Rp)</label>
              <div className="input-wrapper"><input type="number" className="input-field" value={newTarget} onChange={e => setNewTarget(+e.target.value)} /></div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setAddModal(false)}>Batal</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleCreate}>Buat Target</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TargetImpian;
