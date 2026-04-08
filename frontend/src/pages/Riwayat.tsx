import { useState, useEffect } from 'react';
import { ArrowDownRight, ArrowUpRight, Plus, Trash2, Search, Calendar, FileText, Download } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, BarChart, Bar } from 'recharts';
import { bffService } from '../lib/services';
import CurrencyInput from '../components/CurrencyInput';
import Skeleton from '../components/Skeleton';

const TableSkeleton = () => (
  <div className="glass-card" style={{ overflowX: 'auto', marginTop: '1rem' }}>
    <table className="data-table" style={{ width: '100%' }}>
      <thead>
        <tr>
          <th style={{ padding: '1rem' }}><Skeleton width="100px" height="0.6rem" /></th>
          <th style={{ padding: '1rem' }}><Skeleton width="80px" height="0.6rem" /></th>
          <th style={{ padding: '1rem' }}><Skeleton width="60px" height="0.6rem" /></th>
          <th style={{ padding: '1rem', textAlign: 'right' }}><Skeleton width="80px" height="0.6rem" style={{ marginLeft: 'auto' }} /></th>
          <th style={{ width: '40px' }}></th>
        </tr>
      </thead>
      <tbody>
        {[1,2,3,4,5].map(i => (
          <tr key={i}>
            <td style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Skeleton width="2.5rem" height="2.5rem" borderRadius="0.75rem" />
                <Skeleton width="150px" height="0.9rem" />
              </div>
            </td>
            <td style={{ padding: '1rem' }}><Skeleton width="90px" height="1.25rem" borderRadius="2rem" /></td>
            <td style={{ padding: '1rem' }}><Skeleton width="70px" height="0.8rem" /></td>
            <td style={{ padding: '1rem', textAlign: 'right' }}><Skeleton width="110px" height="1rem" style={{ marginLeft: 'auto' }} /></td>
            <td style={{ padding: '1rem' }}><Skeleton width="20px" height="20px" borderRadius="4px" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

import StreakCelebration from '../components/StreakCelebration';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const COLORS = ['#FFFFFF', '#AAAAAA', '#777777', '#444444', '#222222', '#111111'];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }> }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '0.75rem 1rem', fontSize: '0.82rem' }}>
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
  const [saving, setSaving] = useState(false);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState<number | ''>('');
  const [catId, setCatId] = useState('');
  const [desc, setDesc] = useState('');

  const [showStreak, setShowStreak] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [txResult, catResult] = await Promise.all([
        bffService.getTransactions(),
        bffService.getCategories()
      ]);
      setTransactions(txResult.data || []);
      setCategories(catResult.data || []);
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
      setSaving(true);
      const result = await bffService.createTransaction({
        type, amount: Number(amount), category_id: catId, description: desc
      });
      
      setModal(false);
      setAmount(''); setCatId(''); setDesc('');
      fetchData();

      if (result.streakResult?.incremented) {
        setStreakCount(result.streakResult.newStreak);
        setShowStreak(true);
      }
    } catch (err) {
      console.error(err);
      alert('Gagal menambah transaksi');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm('Hapus transaksi ini?')) return;
    try {
      await bffService.deleteTransaction(id);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus');
    }
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      
      doc.setDrawColor(139, 92, 246);
      doc.setLineWidth(1);
      doc.line(14, 25, 45, 25);
      
      doc.setFontSize(22);
      doc.setTextColor(139, 92, 246);
      doc.setFont('helvetica', 'bold');
      doc.text('SakuCerdas', 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.setFont('helvetica', 'normal');
      doc.text('Smart Financial Management', 14, 30);
      doc.text(`Laporan Transaksi - ${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`, 14, 38);
      doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 43);
      
      const tableData = filteredTransactions.map(t => [
        new Date(t.date).toLocaleDateString('id-ID'),
        t.description || '-',
        t.categories?.name || '-',
        t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        `Rp${t.amount.toLocaleString('id-ID')}`
      ]);

      autoTable(doc, {
        startY: 50,
        head: [['Tanggal', 'Keterangan', 'Kategori', 'Tipe', 'Nominal']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [139, 92, 246] },
        styles: { fontSize: 9 }
      });

      doc.save(`SakuCerdas_Laporan_${new Date().getTime()}.pdf`);
    } catch (err) {
      console.error('PDF Export Error:', err);
      alert('Gagal membuat PDF. Silakan coba lagi.');
    }
  };

  const handleExportExcel = () => {
    const data = filteredTransactions.map(t => ({
      Tanggal: t.date,
      Keterangan: t.description || '-',
      Kategori: t.categories?.name || '-',
      Tipe: t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      Nominal: t.amount
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transaksi");
    XLSX.writeFile(workbook, `SakuCerdas_Laporan_${new Date().getTime()}.xlsx`);
  };

  const totalIn = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const expensesList = transactions.filter(t => t.type === 'expense');
  const pieMap: Record<string, number> = {};
  expensesList.forEach(t => {
    const cName = t.categories?.name || 'Lainnya';
    pieMap[cName] = (pieMap[cName] || 0) + t.amount;
  });
  const pieData = Object.keys(pieMap).map(k => ({ name: k, value: pieMap[k] })).sort((a,b) => b.value - a.value).slice(0, 6);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = (t.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCat === '' || t.category_id === filterCat;
    const tDate = new Date(t.date);
    const matchesStart = !dateRange.start || tDate >= new Date(dateRange.start);
    const matchesEnd = !dateRange.end || tDate <= new Date(dateRange.end);
    return matchesSearch && matchesCat && matchesStart && matchesEnd;
  });

  const comparisonData = (() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const thisYear = now.getFullYear();
    const lastYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const data = [
      { name: 'Bulan Lalu', income: 0, expense: 0 },
      { name: 'Bulan Ini', income: 0, expense: 0 }
    ];

    transactions.forEach(t => {
      const d = new Date(t.date);
      if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
        if (t.type === 'income') data[1].income += t.amount;
        else data[1].expense += t.amount;
      } else if (d.getMonth() === lastMonth && d.getFullYear() === lastYear) {
        if (t.type === 'income') data[0].income += t.amount;
        else data[0].expense += t.amount;
      }
    });
    return data;
  })();

  const trendData = (() => {
    const map: Record<string, { masuk: number; keluar: number }> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = d.toLocaleString('id-ID', { month: 'short' });
      map[mName] = { masuk: 0, keluar: 0 };
    }
    
    transactions.forEach(t => {
      const txDate = new Date(t.date);
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
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            <Plus size={15}/> Catat
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '0.25rem' }}>
          <button onClick={() => setTab('list')} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 600, background: tab === 'list' ? 'var(--bg-card)' : 'transparent', color: tab === 'list' ? 'var(--text)' : 'var(--text-muted)', transition: 'all 0.2s', border: `1px solid ${tab === 'list' ? 'var(--border)' : 'transparent'}` }}>List</button>
          <button onClick={() => setTab('chart')} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.82rem', fontWeight: 600, background: tab === 'chart' ? 'var(--bg-card)' : 'transparent', color: tab === 'chart' ? 'var(--text)' : 'var(--text-muted)', transition: 'all 0.2s', border: `1px solid ${tab === 'chart' ? 'var(--border)' : 'transparent'}` }}>Analisis</button>
        </div>

        {tab === 'list' && (
          <div style={{ display: 'flex', flex: 1, gap: '0.75rem', flexWrap: 'wrap' }}>
            <div className="input-wrapper" style={{ flex: 1, minWidth: '150px', position: 'relative' }}>
               <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
               <input type="text" placeholder="Cari..." className="input-field" style={{ paddingLeft: '2.5rem', fontSize: '0.85rem' }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <select className="input-field" style={{ width: 'auto', fontSize: '0.85rem', padding: '0 0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem', cursor: 'pointer', background: 'var(--bg)' }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
               <option value="">Semua Kategori</option>
               {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
               <Calendar size={14} className="text-muted" />
               <input type="date" className="input-field" style={{ width: 'auto', fontSize: '0.8rem', padding: '0.3rem 0.5rem', border: '1px solid var(--border)', borderRadius: '0.5rem', cursor: 'pointer', background: 'var(--bg)' }} value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} />
               <span className="text-muted">–</span>
               <input type="date" className="input-field" style={{ width: 'auto', fontSize: '0.8rem', padding: '0.3rem 0.5rem', border: '1px solid var(--border)', borderRadius: '0.5rem', cursor: 'pointer', background: 'var(--bg)' }} value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} />
            </div>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
               <button className="btn btn-ghost" style={{ padding: '0.5rem', border: '1px solid var(--border)' }} onClick={handleExportPDF} title="Unduh PDF">
                  <FileText size={16} />
               </button>
               <button className="btn btn-ghost" style={{ padding: '0.5rem', border: '1px solid var(--border)' }} onClick={handleExportExcel} title="Unduh Excel">
                  <Download size={16} />
               </button>
            </div>
          </div>
        )}
      </div>

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
        <TableSkeleton />
      ) : tab === 'list' ? (
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          {filteredTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{searchTerm || filterCat ? 'Hasil tidak ditemukan' : 'Belum ada transaksi'}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                {searchTerm || filterCat ? 'Coba ganti kata kunci atau filter Anda.' : 'Mulai catat pengeluaran pertamamu di sini.'}
              </p>
              {!searchTerm && !filterCat && (
                <button className="btn btn-primary" style={{ margin: '0 auto' }} onClick={() => setModal(true)}>
                  Catat Transaksi
                </button>
              )}
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
                {filteredTransactions.map(t => (
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
          
          <div className="glass-card" style={{ gridColumn: 'span 2' }}>
            <div style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.95rem' }}>Perbandingan Pengeluaran & Pemasukan</div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#555', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `Rp${v/1000000}Jt`} />
                <Tooltip formatter={(v) => [`Rp${Number(v).toLocaleString('id-ID')}`]} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.8rem' }} />
                <Legend iconType="circle" />
                <Bar dataKey="income" fill="#22C55E" name="Pemasukan" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#EF4444" name="Pengeluaran" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card">
            <div style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.95rem' }}>Breakdown Kategori Pengeluaran</div>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`Rp${Number(v).toLocaleString('id-ID')}`]} contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.8rem' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.25rem' }}>
                  {pieData.map((d, i) => {
                    const total = pieData.reduce((s, x) => s + x.value, 0);
                    const pct = Math.round((d.value / total) * 100);
                    return (
                      <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
                          {d.name}
                        </div>
                        <div style={{ fontWeight: 600 }}>{pct}%</div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>Belum ada data pengeluaran.</div>
            )}
          </div>

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
              <div className="input-wrapper"><CurrencyInput className="input-field" value={amount as number} onChange={(val) => setAmount(val as number || '')} /></div>
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
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAdd} disabled={saving || !amount || !catId}>
                {saving ? 'Menyimpan...' : 'Simpan Transaksi'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showStreak && <StreakCelebration streak={streakCount} onClose={() => setShowStreak(false)} />}
    </div>
  );
};
export default Riwayat;
