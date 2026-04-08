import { useState, useEffect } from 'react';
import { Repeat, Plus, Trash2, Power, PowerOff, Calendar, Tag, CreditCard } from 'lucide-react';
import { bffService } from '../lib/services';
import CurrencyInput from '../components/CurrencyInput';
import Skeleton from '../components/Skeleton';
import { useToast } from '../context/ToastContext';

const RecurringSkeleton = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {[1, 2, 3].map(i => (
      <div key={i} className="glass-card" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Skeleton width="1.8rem" height="1.8rem" borderRadius="0.5rem" />
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Skeleton width="120px" height="1rem" />
                <Skeleton width="60px" height="1rem" borderRadius="1rem" />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Skeleton width="80px" height="0.8rem" />
                <Skeleton width="60px" height="0.8rem" />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Skeleton width="2rem" height="2rem" borderRadius="0.5rem" />
            <Skeleton width="2rem" height="2rem" borderRadius="0.5rem" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const RecurringTransactions = () => {
  const { showToast } = useToast();
  const [recurring, setRecurring] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '' as number | '',
    category_id: '',
    description: '',
    interval: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    next_date: new Date().toISOString().split('T')[0],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rRes, cRes] = await Promise.all([
        bffService.getRecurring(),
        bffService.getCategories(),
      ]);
      setRecurring(rRes.data || []);
      setCategories(cRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return showToast('Nominal dan deskripsi wajib diisi!', 'error');

    try {
      setSaving(true);
      await bffService.createRecurring({
        ...formData,
        amount: Number(formData.amount),
        category_id: formData.category_id || null,
      });
      setModalOpen(false);
      setFormData({ 
        type: 'expense', amount: '', category_id: '', description: '', 
        interval: 'monthly', next_date: new Date().toISOString().split('T')[0] 
      });
      fetchData();
      showToast('Transaksi rutin dijadwalkan!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Gagal menyimpan data', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await bffService.toggleRecurringActive(id, !currentStatus);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus transaksi berulang ini?')) return;
    try {
      await bffService.deleteRecurring(id);
      fetchData();
      showToast('Transaksi dihapus', 'info');
    } catch (err) {
      console.error(err);
      showToast('Gagal menghapus', 'error');
    }
  };

  return (
    <>
      <div className="animate-enter pb-8">
        <div className="top-header">
          <div>
            <div className="header-badge"><Repeat size={12} /> Subs & Rutin</div>
            <h1>Transaksi Berulang</h1>
            <p>Kelola langganan (Netflix, Spotify) atau pengeluaran rutin bulananmu.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={18} /> Tambah Rutinitas
          </button>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Daftar Transaksi Rutin</h3>
          {loading ? (
            <RecurringSkeleton />
          ) : recurring.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
               <Calendar size={48} className="text-muted" style={{ opacity: 0.3, marginBottom: '1rem' }} />
               <p className="text-muted">Belum ada transaksi berulang yang dijadwalkan.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recurring.map(r => (
                <div key={r.id} className="glass-card" style={{ padding: '1rem', border: '1px solid var(--border)', background: r.is_active ? '' : 'rgba(255,255,255,0.02)', opacity: r.is_active ? 1 : 0.6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div className="card-icon bg-dim">
                        <CreditCard size={18} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '1rem' }}>{r.description}</span>
                          <span className="tag" style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--accent-primary)', fontSize: '0.7rem' }}>
                            {r.interval === 'monthly' ? 'Bulanan' : r.interval === 'weekly' ? 'Mingguan' : r.interval}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                           <div style={{ fontWeight: 800, color: r.type === 'income' ? 'var(--success)' : 'var(--text)' }}>
                             Rp{r.amount.toLocaleString('id-ID')}
                           </div>
                           <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                             <Tag size={12} /> {r.categories?.name || 'Umum'}
                           </div>
                           <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                             Jadwal Berikutnya: {new Date(r.next_date).toLocaleDateString('id-ID')}
                           </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className={`btn ${r.is_active ? 'btn-ghost' : 'btn-primary'}`} style={{ padding: '0.5rem' }} onClick={() => handleToggleActive(r.id, r.is_active)}>
                        {r.is_active ? <PowerOff size={16} /> : <Power size={16} />}
                      </button>
                      <button className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--danger)' }} onClick={() => handleDelete(r.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div className="modal-title">Atur Transaksi Rutin</div>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Tipe</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" className={`btn ${formData.type === 'income' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1 }} onClick={() => setFormData({...formData, type: 'income'})}>Pemasukan Tetap</button>
                  <button type="button" className={`btn ${formData.type === 'expense' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1 }} onClick={() => setFormData({...formData, type: 'expense'})}>Pengeluaran Rutin</button>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Nama / Deskripsi</label>
                <div className="input-wrapper">
                  <input className="input-field" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Contoh: Netflix, Kost, Internet" />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Nominal (Rp)</label>
                <div className="input-wrapper">
                  <CurrencyInput className="input-field" value={formData.amount as number} onChange={(val) => setFormData({...formData, amount: val as number})} />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Interval</label>
                <div className="input-wrapper">
                  <select className="input-field" value={formData.interval} onChange={e => setFormData({...formData, interval: e.target.value as any})}>
                    <option value="daily">Harian</option>
                    <option value="weekly">Mingguan</option>
                    <option value="monthly">Bulanan</option>
                    <option value="yearly">Tahunan</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Kategori</label>
                <div className="input-wrapper">
                  <select className="input-field" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                    <option value="">Pilih Kategori</option>
                    {categories.filter(c => c.type === formData.type).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Tanggal Mulai / Penagihan Pertama</label>
                <div className="input-wrapper">
                  <input type="date" className="input-field" value={formData.next_date} onChange={e => setFormData({...formData, next_date: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                  {saving ? 'Menjadwalkan...' : 'Mulai Jadwal Rutin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
export default RecurringTransactions;
