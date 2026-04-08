import { useState, useEffect } from 'react';
import { PlusCircle, Target as TargetIcon, CheckCircle, Trash2 } from 'lucide-react';
import { bffService } from '../lib/services';
import type { Target } from '../lib/supabase';
import CurrencyInput from '../components/CurrencyInput';
import Skeleton from '../components/Skeleton';

const TargetSkeleton = () => (
  <div className="dashboard-grid">
    {[1, 2, 3].map(i => (
      <div key={i} className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1 }}>
            <Skeleton width="40%" height="0.7rem" style={{ marginBottom: '0.5rem' }} />
            <Skeleton width="80%" height="1.2rem" style={{ marginBottom: '0.5rem' }} />
            <Skeleton width="60%" height="0.8rem" />
          </div>
          <Skeleton width="2.5rem" height="2.5rem" borderRadius="0.75rem" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <Skeleton width="20%" height="0.7rem" />
          <Skeleton width="15%" height="0.7rem" />
        </div>
        <Skeleton width="100%" height="6px" borderRadius="10px" style={{ marginBottom: '1.5rem' }} />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Skeleton width="70%" height="2.2rem" borderRadius="0.6rem" />
          <Skeleton width="30%" height="2.2rem" borderRadius="0.6rem" />
        </div>
      </div>
    ))}
  </div>
);

const TargetImpian = () => {
  const [targets, setTargets]   = useState<Target[]>([]);
  const [loading, setLoading]   = useState(true);
  
  const [modal, setModal]       = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selected, setSelected] = useState<Target | null>(null);
  
  const [addAmt, setAddAmt]     = useState(50000);
  const [newName, setNewName]   = useState('');
  const [newTarget, setNewTarget] = useState(1000000);
  const [saving, setSaving] = useState(false);

  const fetchTargets = async () => {
    try {
      setLoading(true);
      const result = await bffService.getTargets();
      setTargets(result.data || []);
    } catch (err) {
      console.error('Failed to fetch targets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTargets();
  }, []);

  const pct = (t: Target) => Math.min(Math.round((t.current_amount / t.target_amount) * 100), 100);

  const openAdd = (t: Target) => { setSelected(t); setModal(true); setAddAmt(50000); };
  
  const handleAdd = async () => {
    if (!selected || addAmt <= 0) return;
    try {
      setSaving(true);
      await bffService.depositTarget({ 
        targetId: selected.id, 
        amount: addAmt, 
        note: 'Deposit manual UI' 
      });
      setModal(false);
      fetchTargets();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Gagal menambah saldo');
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    if (!newName || newTarget <= 0) return;
    try {
      setSaving(true);
      await bffService.createTarget({ name: newName, target_amount: newTarget });
      setNewName(''); setNewTarget(1000000); setAddModal(false);
      fetchTargets();
    } catch (err) {
      console.error(err);
      alert('Gagal membuat target');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus target ini?')) return;
    try {
      await bffService.deleteTarget(id);
      fetchTargets();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus target');
    }
  };

  return (
    <>
      <div className="animate-enter pb-8">
        <div className="top-header">
          <div>
            <div className="header-badge"><TargetIcon size={12} /> {targets.length} Target Aktif</div>
            <h1>Target Impian</h1>
            <p>Pantau progres menuju impian finansialmu.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setAddModal(true)}>
            <PlusCircle size={15} /> Buat Target
          </button>
        </div>

        {loading ? (
          <TargetSkeleton />
        ) : targets.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <TargetIcon size={40} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Belum Ada Target</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Punya impian barang atau liburan? Yuk mulai target nabung pertamamu!</p>
            <button className="btn btn-primary" style={{ margin: '0 auto' }} onClick={() => setAddModal(true)}>
               Mulai Buat Target
            </button>
          </div>
        ) : (
          <div className="dashboard-grid">
            {targets.map(t => {
              const p = pct(t);
              const done = p >= 100 || t.is_completed;
              return (
                <div key={t.id} className="glass-card" style={done ? { borderColor: 'rgba(34,197,94,0.25)' } : {}}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    <div>
                      <div className="card-title">Target</div>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '0.2rem' }}>{t.name}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Rp{t.current_amount.toLocaleString('id-ID')} / Rp{t.target_amount.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {done && <div className="icon-box bg-success"><CheckCircle size={14} /></div>}
                      <div className="card-icon bg-dim" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <TargetIcon size={15} />
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
                    {!done && (
                      <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.82rem', padding: '0.5rem' }} onClick={() => openAdd(t)}>
                        <PlusCircle size={14} /> Nabung
                      </button>
                    )}
                    <button className="btn btn-danger" style={{ padding: '0.5rem 0.75rem', flex: done ? 1 : 'unset' }} onClick={() => handleDelete(t.id)}>
                      <Trash2 size={14} /> {done && 'Hapus'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add saldo modal */}
      {modal && selected && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Nabung Cepat</div>
            <div className="modal-desc">Target: <strong>{selected.name}</strong></div>
            <div className="input-group">
              <label className="input-label">Nominal (Rp)</label>
              <div className="input-wrapper"><CurrencyInput className="input-field" value={addAmt as number} onChange={(val) => setAddAmt(val as number || 0)} /></div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setModal(false)}>Batal</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAdd} disabled={saving || !addAmt}>
                {saving ? 'Menyimpan...' : 'Simpan Tabungan'}
              </button>
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
              <label className="input-label">Nama Target (Impian)</label>
              <div className="input-wrapper"><input type="text" className="input-field" placeholder="e.g. Dana Umroh" value={newName} onChange={e => setNewName(e.target.value)} /></div>
            </div>
            <div className="input-group">
              <label className="input-label">Nominal Target (Rp)</label>
              <div className="input-wrapper"><CurrencyInput className="input-field" value={newTarget as number} onChange={(val) => setNewTarget(val as number || 0)} /></div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setAddModal(false)}>Batal</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleCreate} disabled={saving || !newName || !newTarget}>
                {saving ? 'Memproses...' : 'Buat Target'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default TargetImpian;
