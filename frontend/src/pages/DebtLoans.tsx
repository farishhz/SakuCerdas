import { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, CheckCircle2, Clock, Wallet, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { debtService } from '../lib/services';
import CurrencyInput from '../components/CurrencyInput';

const DebtLoans = () => {
  const [debts, setDebts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    type: 'debt' as 'debt' | 'loan',
    person_name: '',
    amount: '' as number | '',
    description: '',
    due_date: '',
  });

  const fetchDebts = async () => {
    try {
      setLoading(true);
      const data = await debtService.getAll();
      setDebts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.person_name || !formData.amount) return alert('Nama dan nominal wajib diisi!');

    try {
      setSaving(true);
      await debtService.create({
        ...formData,
        amount: Number(formData.amount),
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
      });
      setModalOpen(false);
      setFormData({ type: 'debt', person_name: '', amount: '', description: '', due_date: '' });
      fetchDebts();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePaid = async (id: string, currentStatus: boolean) => {
    try {
      await debtService.markPaid(id, !currentStatus);
      fetchDebts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus catatan ini?')) return;
    try {
      await debtService.delete(id);
      fetchDebts();
    } catch (err) {
      console.error(err);
    }
  };

  const totalDebt = debts.filter(d => d.type === 'debt' && !d.is_paid).reduce((s, d) => s + d.amount, 0);
  const totalLoan = debts.filter(d => d.type === 'loan' && !d.is_paid).reduce((s, d) => s + d.amount, 0);

  return (
    <>
      <div className="animate-enter pb-8">
        <div className="top-header">
          <div>
            <div className="header-badge"><CreditCard size={12} /> Hutang & Piutang</div>
            <h1>Kelola Pinjaman</h1>
            <p>Catat siapa yang meminjam uangmu atau keuangan yang harus kamu bayar.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={18} /> Tambah Catatan
          </button>
        </div>

        <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
          <div className="glass-card">
            <div className="card-header">
              <div className="card-icon bg-danger-dim"><ArrowUpRight size={18} /></div>
              <div className="card-title">Total Hutang Kamu</div>
            </div>
            <div className="card-value" style={{ color: 'var(--danger)' }}>Rp{totalDebt.toLocaleString('id-ID')}</div>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Uang yang harus kamu kembalikan.</p>
          </div>
          <div className="glass-card">
            <div className="card-header">
              <div className="card-icon bg-success-dim"><ArrowDownRight size={18} /></div>
              <div className="card-title">Total Piutang (Uang di Orang)</div>
            </div>
            <div className="card-value" style={{ color: 'var(--success)' }}>Rp{totalLoan.toLocaleString('id-ID')}</div>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Uang teman/saudara yang ada di kamu.</p>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Daftar Pinjaman</h3>
          {loading ? (
            <p>Memuat data...</p>
          ) : debts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
               <Wallet size={48} className="text-muted" style={{ opacity: 0.3, marginBottom: '1rem' }} />
               <p className="text-muted">Belum ada catatan hutang atau piutang.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {debts.map(d => (
                <div key={d.id} className={`glass-card ${d.is_paid ? 'opacity-50' : ''}`} style={{ padding: '1rem', border: d.is_paid ? '1px solid transparent' : '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div className={`card-icon ${d.type === 'debt' ? 'bg-danger-dim' : 'bg-success-dim'}`}>
                        {d.type === 'debt' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '1rem' }}>{d.person_name}</span>
                          <span className={`tag ${d.type === 'debt' ? 'tag-danger' : 'tag-success'}`} style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>
                            {d.type === 'debt' ? 'Hutang' : 'Piutang'}
                          </span>
                          {d.is_paid && <span className="tag tag-dim" style={{ fontSize: '0.75rem' }}>Lunas</span>}
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0.25rem 0' }}>
                          Rp{d.amount.toLocaleString('id-ID')}
                        </div>
                        {d.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{d.description}</p>}
                        {d.due_date && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            <Clock size={12} /> JT: {new Date(d.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className={`btn ${d.is_paid ? 'btn-ghost' : 'btn-success'}`} style={{ padding: '0.5rem' }} onClick={() => handleTogglePaid(d.id, d.is_paid)}>
                        <CheckCircle2 size={16} />
                      </button>
                      <button className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--danger)' }} onClick={() => handleDelete(d.id)}>
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
            <div className="modal-title">Catat Hutang / Piutang</div>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Tipe Pinjaman</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" className={`btn ${formData.type === 'debt' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1 }} onClick={() => setFormData({...formData, type: 'debt'})}>Saya Berhutang</button>
                  <button type="button" className={`btn ${formData.type === 'loan' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1 }} onClick={() => setFormData({...formData, type: 'loan'})}>Saya Meminjamkan</button>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Nama Orang/Pihak</label>
                <div className="input-wrapper">
                  <input className="input-field" value={formData.person_name} onChange={e => setFormData({...formData, person_name: e.target.value})} placeholder="Contoh: Budi atau Bank BCA" />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Nominal (Rp)</label>
                <div className="input-wrapper">
                  <CurrencyInput className="input-field" value={formData.amount} onChange={val => setFormData({...formData, amount: val})} />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Jatuh Tempo (Opsional)</label>
                <div className="input-wrapper">
                  <input type="date" className="input-field" value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Catatan</label>
                <div className="input-wrapper">
                  <textarea className="input-field" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Untuk apa?" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Simpan Catatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DebtLoans;
