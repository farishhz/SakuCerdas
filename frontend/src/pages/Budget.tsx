import { useState, useEffect } from 'react';
import { PiggyBank, Plus, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { budgetService, transactionService, categoryService } from '../lib/services';
import type { Budget as SupabaseBudget, Category } from '../lib/supabase';
import CurrencyInput from '../components/CurrencyInput';

type BudgetWithSpent = SupabaseBudget & { spent: number };

const Budget = () => {
  const [budgets, setBudgets] = useState<BudgetWithSpent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [modal, setModal] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState('');
  const [newLimit, setNewLimit] = useState(500000);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [fetchedBudgets, fetchedCategories] = await Promise.all([
        budgetService.getAll(),
        categoryService.getAll('expense')
      ]);

      setCategories(fetchedCategories || []);

      if (fetchedBudgets && fetchedBudgets.length > 0) {
        const now = new Date();
        const expenses = await transactionService.getAll({
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          type: 'expense'
        });

        const merged: BudgetWithSpent[] = fetchedBudgets.map(b => {
          const spent = expenses
            ?.filter(t => t.category_id === b.category_id)
            .reduce((sum, t) => sum + t.amount, 0) || 0;
          return { ...b, spent };
        });
        
        // Sort by percent used
        setBudgets(merged.sort((a,b) => (b.spent/b.limit_amount) - (a.spent/a.limit_amount)));
      } else {
        setBudgets([]);
      }
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const pct = (b: BudgetWithSpent) => Math.round((b.spent / b.limit_amount) * 100);
  const status = (p: number) => p > 100 ? 'danger' : p >= 80 ? 'warning' : 'success';
  const statusText = (p: number) => p > 100 ? 'Overbudget' : p >= 80 ? 'Hampir Habis' : 'Aman';

  const handleCreate = async () => {
    if (!selectedCatId || newLimit <= 0) return;
    try {
      await budgetService.create({ category_id: selectedCatId, limit_amount: newLimit });
      setSelectedCatId(''); setNewLimit(500000); setModal(false);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert('Gagal membuat budget (mungkin kategori ini sudah punya budget di bulan ini).');
    }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm('Hapus budget ini?')) return;
    try {
      await budgetService.delete(id);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus budget.');
    }
  };

  return (
    <div className="animate-enter pb-8">
      <div className="top-header">
        <div>
          <div className="header-badge"><PiggyBank size={12} /> Manajemen Budget</div>
          <h1>Budget Kategori</h1>
          <p>Atur batas pengeluaran per kategori agar keuangan bulan ini tetap sehat.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal(true)}>
          <Plus size={15} /> Tambah Budget
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Memuat budget...</div>
      ) : (
        <>
          {/* Overview */}
          <div className="dashboard-grid">
            <div className="glass-card">
              <div className="card-title">Total Budget</div>
              <div className="card-value">Rp{budgets.reduce((a, c) => a + c.limit_amount, 0).toLocaleString('id-ID')}</div>
            </div>
            <div className="glass-card">
              <div className="card-title">Total Terpakai</div>
              <div className="card-value">Rp{budgets.reduce((a, c) => a + c.spent, 0).toLocaleString('id-ID')}</div>
            </div>
            <div className="glass-card">
              <div className="card-title">Kategori Overbudget</div>
              <div className="card-value text-danger">{budgets.filter(c => pct(c) > 100).length} Kategori</div>
            </div>
          </div>

          {budgets.length === 0 ? (
             <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <PiggyBank size={40} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                <h3 style={{ marginBottom: '0.5rem' }}>Belum Ada Budget</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Tentukan limit pengeluaran bulananmu agar uang tidak cepat habis!</p>
                <button className="btn btn-primary" style={{ margin: '0 auto' }} onClick={() => setModal(true)}>
                  Set Budget Pertama
                </button>
             </div>
          ) : (
            budgets.map(b => {
              const p = pct(b);
              const st = status(p);
              return (
                <div key={b.id} className="glass-card" style={{ marginBottom: '0.75rem', borderColor: st === 'danger' ? 'rgba(239,68,68,0.2)' : st === 'warning' ? 'rgba(245,158,11,0.2)' : 'var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className={`icon-box bg-${st}`}>
                        {st === 'danger' ? <AlertTriangle size={14} /> : st === 'warning' ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                      </div>
                      <div>
                        {/* Jika category query ada di services.ts kita akses b.categories */}
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{b.categories?.name ?? 'Kategori'}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          Rp{b.spent.toLocaleString('id-ID')} / Rp{b.limit_amount.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <span className={`tag tag-${st}`}>{statusText(p)}</span>
                      <button className="btn btn-ghost text-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => handleDelete(b.id)}>
                        <Trash2 size={12} style={{ marginRight: '0.25rem' }}/> Hapus
                      </button>
                    </div>
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
            })
          )}
        </>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Tambah Budget</div>
            <div className="modal-desc">Tentukan batas maksimal pengeluaran bulan ini.</div>
            
            <div className="input-group">
              <label className="input-label">Pilih Kategori Pengeluaran</label>
              <div className="input-wrapper" style={{ padding: '0' }}>
                <select className="input-field" style={{ padding: '0.75rem', borderRadius: '0.5rem' }} value={selectedCatId} onChange={e => setSelectedCatId(e.target.value)}>
                  <option value="" disabled>-- Pilih Kategori --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Batas Budget / Bulan (Rp)</label>
              <div className="input-wrapper"><CurrencyInput className="input-field" value={newLimit as number} onChange={(val) => setNewLimit(val as number || 0)} /></div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setModal(false)}>Batal</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleCreate}>Simpan Budget</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Budget;
