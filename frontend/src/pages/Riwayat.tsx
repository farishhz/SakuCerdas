import { useState, useEffect } from 'react';
import { ArrowDownRight, ArrowUpRight, Plus, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { transactionService, categoryService } from '../lib/services';
import type { Transaction, Category } from '../lib/supabase';
import CurrencyInput from '../components/CurrencyInput';

const COLORS = ['#FFFFFF', '#AAAAAA', '#777777', '#444444', '#222222', '#111111'];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }> }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.75rem 1rem', fontSize: '0.82rem' }}>
        {payload.map((p) => (
          <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>
            {p.name}: Rp{(+(p.value || 0)).toLocaleString('id-ID')}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Riwayat = () => {
  const [tab, setTab] = useState<'list' | 'chart'>('list');
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState<number | ''>('');
  const [catId, setCatId] = useState('');
  const [desc, setDesc] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [txs, cats] = await Promise.all([
        transactionService.getAll(),
        categoryService.getAll()
      ]);
      setTransactions(txs || []);
      setCategories(cats || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!amount || !catId || amount <= 0) return;
    try {
      await transactionService.create({
        type, amount: Number(amount), category_id: catId, description: desc
      });
      setModal(false);
      setAmount(''); setCatId(''); setDesc('');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Gagal menambah transaksi');
    }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm('Hapus transaksi ini?')) return;
    try {
      await transactionService.delete(id);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus');
    }
  };

  // Calc summary
  const totalIn = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  // Calc Pie chart (Expenses by category)
  const expensesList = transactions.filter(t => t.type === 'expense');
  const pieMap: Record<string, number> = {};
  expensesList.forEach(t => {
    const cName = t.categories?.name || 'Lainnya';
    pieMap[cName] = (pieMap[cName] || 0) + t.amount;
  });
  const pieData = Object.keys(pieMap).map(k => ({ name: k, value: pieMap[k] })).sort((a,b) => b.value - a.value).slice(0, 6); // top 6

  // Calc Line Trend (Last 6 Months)
  const trendData = (() => {
    const map: Record<string, { masuk: number; keluar: number }> = {};
    const now = new Date();
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = d.toLocaleString('id-ID', { month: 'short' });
      map[mName] = { masuk: 0, keluar: 0 };
    }
    
    transactions.forEach(t => {
      const txDate = new Date(t.date);
      // Only include if in the last 6 months roughly
      const mName = txDate.toLocaleString('id-ID', { month: 'short' });
      if (map[mName]) {
        if (t.type === 'income') map[mName].masuk += t.amount;
        else map[mName].keluar += t.amount;
      }
    });
    return Object.keys(map).map(k => ({ bln: k, ...map[k] }));
  })();

  const filteredCats = categories.filter(c => c.type === type);

  return (
    <div className="animate-enter pb-8">
      <div className="top-header">
        <div>
          <div className="header-badge">Catatan Keuangan</div>
          <h1>Riwayat Transaksi</h1>
          <p>Pantau arus kas dan analisis pengeluaranmu.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            <Plus size={15}/> Catat
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '0.25rem', marginBottom: '1.5rem', width: 'fit-content' }}>
        <button onClick={() => setTab('list')} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 600, background: tab === 'list' ? 'white' : 'transparent', color: tab === 'list' ? '#080808' : 'var(--text-muted)', transition: 'all 0.2s' }}>List</button>
        <button onClick={() => setTab('chart')} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 600, background: tab === 'chart' ? 'white' : 'transparent', color: tab === 'chart' ? '#080808' : 'var(--text-muted)', transition: 'all 0.2s' }}>Analisis</button>
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

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Memuat transaksi...</div>
      ) : tab === 'list' ? (
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          {transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Belum ada transaksi</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>Mulai catat pengeluaran pertamamu di sini.</p>
              <button className="btn btn-primary" style={{ margin: '0 auto' }} onClick={() => setModal(true)}>
                Catat Transaksi
              </button>
            </div>
          ) : (
            <table className="data-table" style={{ width: '100%', minWidth: '500px' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>Keterangan</th>
                  <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>Kategori</th>
                  <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>Tanggal</th>
                  <th style={{ textAlign: 'right', padding: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>Nominal</th>
                  <th style={{ width: '40px', borderBottom: '1px solid var(--border)' }}></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id}>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className={`icon-box ${t.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                          {t.type === 'income' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.description || 'Tanpa Keterangan'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                      <span className="tag tag-default">{t.categories?.name || '-'}</span>
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 700, color: t.type === 'income' ? 'var(--success)' : 'var(--danger)', fontFamily: 'var(--font-mono)' }}>
                      {t.type === 'income' ? '+' : '-'}Rp{t.amount.toLocaleString('id-ID')}
                    </td>
                    <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                      <button className="btn btn-ghost text-danger" style={{ padding: '0.4rem' }} onClick={() => handleDelete(t.id)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {/* Donut */}
          <div className="glass-card">
            <div style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.95rem' }}>Distribusi Pengeluaran</div>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`Rp${Number(v).toLocaleString('id-ID')}`]} contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', fontSize: '0.8rem' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem', justifyContent: 'center' }}>
                  {pieData.map((d, i) => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                      {d.name}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>Belum ada pengeluaran</div>
            )}
          </div>

          {/* Line Chart */}
          <div className="glass-card">
            <div style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.95rem' }}>Tren 6 Bulan Terakhir</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="bln" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}Jt`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.75rem', color: '#666' }} />
                <Line type="monotone" dataKey="masuk" stroke="#22C55E" strokeWidth={2} dot={{ r: 3, fill: '#22C55E' }} activeDot={{ r: 5 }} name="Masuk" />
                <Line type="monotone" dataKey="keluar" stroke="#EF4444" strokeWidth={2} dot={{ r: 3, fill: '#EF4444' }} activeDot={{ r: 5 }} name="Keluar" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Catat Transaksi Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Catat Transaksi</div>
            <div className="modal-desc">Masukkan detail pendapatan atau pengeluaran baru.</div>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button 
                className="btn btn-ghost" 
                style={{ flex: 1, justifyContent: 'center', background: type === 'expense' ? 'rgba(239,68,68,0.1)' : 'transparent', color: type === 'expense' ? 'var(--danger)' : '' }} 
                onClick={() => { setType('expense'); setCatId(''); }}
              >
                Pengeluaran
              </button>
              <button 
                className="btn btn-ghost" 
                style={{ flex: 1, justifyContent: 'center', background: type === 'income' ? 'rgba(34,197,94,0.1)' : 'transparent', color: type === 'income' ? 'var(--success)' : '' }} 
                onClick={() => { setType('income'); setCatId(''); }}
              >
                Pemasukan
              </button>
            </div>

            <div className="input-group">
              <label className="input-label">Nominal (Rp)</label>
              <div className="input-wrapper"><CurrencyInput className="input-field" value={amount} onChange={setAmount} /></div>
            </div>

            <div className="input-group">
              <label className="input-label">Kategori</label>
              <div className="input-wrapper" style={{ padding: 0 }}>
                <select className="input-field" style={{ padding: '0.75rem', borderRadius: '0.5rem' }} value={catId} onChange={e => setCatId(e.target.value)}>
                  <option value="" disabled>-- Pilih Kategori --</option>
                  {filteredCats.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Keterangan / Catatan</label>
              <div className="input-wrapper"><input type="text" className="input-field" placeholder="e.g. Makan siang" value={desc} onChange={e => setDesc(e.target.value)} /></div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setModal(false)}>Batal</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAdd}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Riwayat;
