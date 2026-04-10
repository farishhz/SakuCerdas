import { useState } from 'react';
import { Wallet, Target as TargetIcon, Zap, ArrowUpRight, ArrowDownRight, PiggyBank, Flame, Newspaper, Download, Award, Briefcase, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { bffService } from '../lib/services';
import CurrencyInput from '../components/CurrencyInput';
import StreakCelebration from '../components/StreakCelebration';
import Skeleton from '../components/Skeleton';
import { Link } from 'react-router-dom';
import { newsService } from '../lib/newsService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  
  const [nabungAmt, setNabungAmt] = useState<number | ''>('');
  const [selectedTarget, setSelectedTarget] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [streakCount, setStreakCount] = useState(0);

  // New Wallet Form State
  const [walletName, setWalletName] = useState('');
  const [walletType, setWalletType] = useState('cash');
  const [walletBalance, setWalletBalance] = useState<number | ''>('');

  // React Query Fetching
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const res = await bffService.getDashboardSummary();
      return res.data;
    }
  });

  const { data: newsListData, isLoading: newsLoading } = useQuery({
    queryKey: ['news'],
    queryFn: () => newsService.getFinancialNews(3),
    staleTime: 1000 * 60 * 60 // 1 hour
  });

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await bffService.getProfile();
      return res.data;
    }
  });

  // Mutations
  const createWalletMutation = useMutation({
    mutationFn: (newWallet: any) => bffService.createWallet(newWallet),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      setWalletModalOpen(false);
      setWalletName('');
      setWalletBalance('');
      showToast('Dompet baru berhasil ditambahkan!', 'success');
    }
  });

  const deleteWalletMutation = useMutation({
    mutationFn: (id: string) => bffService.deleteWallet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      showToast('Dompet berhasil dihapus.', 'info');
    }
  });

  const handleNabungKilat = async () => {
    if (!selectedTarget) return showToast('Pilih target impian dulu ya!', 'info');
    if (!nabungAmt || nabungAmt <= 0) return showToast('Masukkan nominal yang valid!', 'error');

    const current = Number(selectedTarget.current_amount);
    const target = Number(selectedTarget.target_amount);
    const availableBalance = data?.summary?.balance || 0;

    if (Number(nabungAmt) > availableBalance) {
      return showToast(`Saldo tidak cukup! Saldo kamu: Rp${availableBalance.toLocaleString('id-ID')}`, 'error');
    }

    if (current + Number(nabungAmt) > target) {
      return showToast(`Oops! Tabungan kamu melebihi target. Sisa: Rp${(target - current).toLocaleString('id-ID')}`, 'error');
    }

    try {
      setSaving(true);
      const result = await bffService.depositTarget({
        targetId: selectedTarget.id,
        amount: nabungAmt as number,
        note: 'Nabung Kilat from Dashboard'
      });
      
      showToast(`Berhasil nabung Rp${Number(nabungAmt).toLocaleString('id-ID')} untuk ${selectedTarget.name}!`, 'success');
      setModalOpen(false);
      setNabungAmt('');
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });

      if (result.streakResult?.incremented) {
        setStreakCount(result.streakResult.newStreak);
        setShowStreak(true);
      }
    } catch (err: any) {
      console.error('Nabung kilat error:', err);
      showToast(err.message || 'Gagal nabung. Coba lagi.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    console.log('Generating PDF...');
    try {
      const doc = new jsPDF();
      const now = new Date().toLocaleDateString('id-ID');
      
      doc.setFontSize(22);
      doc.setTextColor(139, 92, 246);
      doc.text('Laporan Keuangan SakuCerdas', 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Periode: ${now}`, 14, 30);
      doc.text(`User: ${data?.userName || 'Pengguna'}`, 14, 36);

      const summaryTable = [
        ['Total Saldo Seluruh Dompet', `Rp${(data?.summary?.balance || 0).toLocaleString('id-ID')}`],
        ['Total Pemasukan (Global)', `Rp${(data?.summary?.totalIncome || 0).toLocaleString('id-ID')}`],
        ['Total Pengeluaran (Global)', `Rp${(data?.summary?.totalExpense || 0).toLocaleString('id-ID')}`]
      ];

      autoTable(doc, {
        startY: 45,
        head: [['Kategori Ringkasan', 'Jumlah']],
        body: summaryTable,
        theme: 'grid',
        headStyles: { fillColor: [139, 92, 246] },
        styles: { fontSize: 10, cellPadding: 5 }
      });

      if (data?.wallets?.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Rincian Dompet & Aset', 14, (doc as any).lastAutoTable.finalY + 15);
        
        const walletRows = data.wallets.map((w: any) => [w.name, w.type.toUpperCase(), `Rp${w.balance.toLocaleString('id-ID')}`, w.is_default ? 'Ya' : '-']);
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 20,
          head: [['Nama Dompet', 'Tipe', 'Saldo', 'Utama']],
          body: walletRows,
          theme: 'striped',
          headStyles: { fillColor: [45, 212, 191] }
        });
      }

      if (data?.targets?.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Progres Target Impian', 14, (doc as any).lastAutoTable.finalY + 15);
        const targetRows = data.targets.map((t: any) => [t.name, `Rp${t.current_amount.toLocaleString('id-ID')}`, `Rp${t.target_amount.toLocaleString('id-ID')}`, `${Math.round((t.current_amount/t.target_amount)*100)}%`]);
        autoTable(doc, {
          startY: (doc as any).lastAutoTable.finalY + 20,
          head: [['Nama Target', 'Terkumpul', 'Target', 'Progress']],
          body: targetRows,
          theme: 'striped',
          headStyles: { fillColor: [217, 70, 239] }
        });
      }

      console.log('Saving PDF...');
      doc.save(`SakuCerdas_Report_${now.replace(/\//g, '-')}.pdf`);
      console.log('PDF saved successfully.');
    } catch (err) {
      console.error('PDF Generation Error:', err);
      showToast('Gagal mencetak laporan.', 'error');
    }
  };

  const getXPProgress = () => {
    const xp = profileData?.xp || 0;
    if (xp < 100) return { pct: (xp / 100) * 100, next: 100 };
    if (xp < 300) return { pct: ((xp - 100) / 200) * 100, next: 300 };
    if (xp < 700) return { pct: ((xp - 300) / 400) * 100, next: 700 };
    if (xp < 1500) return { pct: ((xp - 700) / 800) * 100, next: 1500 };
    return { pct: 100, next: 'MAX' };
  };

  const stats = [
    { label: 'Saldo Bersih', value: `Rp${(data?.summary?.balance ?? 0).toLocaleString('id-ID')}`, icon: Wallet, change: '+12%', up: true },
    { label: 'Pemasukan Bulan Ini', value: `Rp${(data?.summary?.totalIncome ?? 0).toLocaleString('id-ID')}`, icon: ArrowDownRight, change: '+0%', up: true },
    { label: 'Pengeluaran Bulan Ini', value: `Rp${(data?.summary?.totalExpense ?? 0).toLocaleString('id-ID')}`, icon: ArrowUpRight, change: '-5%', up: false },
  ];

  const handleCreateWallet = () => {
    if (!walletName) return showToast('Nama dompet harus diisi', 'error');
    createWalletMutation.mutate({
      name: walletName,
      type: walletType,
      balance: walletBalance || 0,
      is_default: (data?.wallets?.length || 0) === 0
    });
  };

  const handleDeleteWallet = (id: string, name: string) => {
    if (window.confirm(`Hapus dompet "${name}"? Semua rincian saldo akan hilang.`)) {
      deleteWalletMutation.mutate(id);
    }
  };

  return (
    <>
      <div className="animate-enter pb-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div className="header-badge"><Zap size={12} /> Overview</div>
            <h1><span>Halo, </span>{isLoading ? <Skeleton width="120px" height="2rem" /> : <span>{data?.userName}</span>}<span>! 👋</span></h1>
            <p>Ringkasan keuangan kamu per hari ini.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-ghost haptic-press" onClick={handleExportPDF} title="Download Laporan PDF">
              <Download size={18} /> <span className="hide-mobile">Cetak Laporan</span>
            </button>
            <div style={{ 
              display: 'flex', gap: '0.75rem', alignItems: 'center', 
              background: 'var(--accent-grad)', padding: '0.6rem 1.25rem', 
              borderRadius: '1.25rem', color: 'white', border: '1px solid rgba(255,255,255,0.2)', 
              boxShadow: '0 8px 24px rgba(139,92,246,0.25)' 
            }}>
              <Flame size={20} color="#FFA500" fill="#FFA500" />
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, lineHeight: 1 }}>{isLoading ? '..' : <span>{data?.streak}</span>} <span>Hari</span></div>
                <div style={{ fontSize: '0.65rem', opacity: 0.8 }}><span>Saving Streak! 🔥</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* XP PROGRESS BAR */}
        <div className="glass-card haptic-press" style={{ marginBottom: '1.5rem', background: 'rgba(139,92,246,0.08)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div className="card-icon bg-white" style={{ width: '2rem', height: '2rem' }}><Award size={14} /></div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700 }}><span>Level: </span>{profileData?.level || <span>Newbie</span>}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}><span>{profileData?.xp || 0}</span> <span>XP Terkumpul</span></div>
              </div>
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}><span>Target: </span><span>{getXPProgress().next}</span> <span>XP</span></div>
          </div>
          <div className="progress-container" style={{ height: '8px' }}>
            <div className="progress-fill" style={{ width: `${getXPProgress().pct}%` }} />
          </div>
        </div>
        
        <div className="dashboard-grid">
          {isLoading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="glass-card"><Skeleton height="5rem" /></div>
            ))
          ) : (
            stats.map((s) => (
              <div key={s.label} className="glass-card haptic-press">
                <div className="card-header" style={{ marginBottom: '1rem' }}>
                  <div className="card-icon bg-dim"><s.icon size={18} /></div>
                  <div style={{ flex: 1 }}><div className="card-title">{s.label}</div></div>
                  <span className="tag" style={{ background: s.up ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: s.up ? '#22C55E' : '#EF4444' }}>{s.change}</span>
                </div>
                <div className="card-value">{s.value}</div>
              </div>
            ))
          )}

          {newsLoading ? (
            <div className="glass-card"><Skeleton height="5rem" /></div>
          ) : (
            (newsListData || []).map((item, idx) => (
              <Link key={idx} to="/kesehatan" className="glass-card news-card-interactive" style={{ background: 'var(--accent-grad-soft)', borderColor: 'rgba(139,92,246,0.2)', display: 'block' }}>
                <div className="card-header" style={{ marginBottom: '0.75rem' }}>
                  <div className="card-icon bg-purple"><Newspaper size={18} /></div>
                  <div style={{ flex: 1 }}><div className="card-title">Wawasan Finansial</div></div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </div>
                  <p className="text-muted" style={{ fontSize: '0.72rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <span>Sumber: </span><span>{item.source.name}</span>
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--purple-light)', fontSize: '0.75rem', fontWeight: 700, marginTop: '0.2rem' }}>
                    Baca Berita <ArrowUpRight size={12} />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', alignItems: 'start', marginTop: '1rem' }}>
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <div className="card-title">Target Aktif</div>
                <h3 style={{ fontWeight: 850, fontSize: '1.15rem' }}>Impian & Investasi</h3>
              </div>
              <div className="card-icon bg-dim"><TargetIcon size={18} /></div>
            </div>
            
            {isLoading ? <Skeleton height="8rem" /> : (data?.targets?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {data.targets.map((t: any) => {
                  const pct = Math.min(100, Math.round((t.current_amount / t.target_amount) * 100));
                  const done = pct >= 100 || t.is_completed;
                  return (
                    <div key={t.id} className="haptic-press" style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</span>
                         {!done && (
                           <button className="btn btn-ghost" style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem' }} onClick={() => {
                             setSelectedTarget(t);
                             setNabungAmt(50000);
                             setModalOpen(true);
                           }}>
                             <Zap size={12} /> Nabung
                           </button>
                         )}
                      </div>
                      <div className="progress-header" style={{ marginTop: '0.6rem' }}>
                        <span className="text-dim" style={{ fontSize: '0.8rem' }}>
                          <span>Rp</span><span>{t.current_amount.toLocaleString('id-ID')}</span> <span>/ Rp</span><span>{t.target_amount.toLocaleString('id-ID')}</span>
                        </span>
                        <span style={{ fontWeight: 800, color: done ? 'var(--success)' : 'var(--purple-light)' }}><span>{pct}</span>%</span>
                      </div>
                      <div className="progress-container" style={{ height: '6px' }}>
                        <div className={`progress-fill ${done ? 'success' : ''}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Belum ada target? Mulai rencanakan masa depanmu sekarang!</p>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* MULTI WALLET SUMMARY */}
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="card-icon bg-dim"><Briefcase size={18} /></div>
                  <div className="card-title">Dompet & Aset</div>
                </div>
                <button className="btn btn-ghost haptic-press" style={{ padding: '0.4rem', borderRadius: '50%' }} onClick={() => setWalletModalOpen(true)}>
                  <Plus size={16} />
                </button>
              </div>
              {isLoading ? <Skeleton height="6rem" /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                   {(data?.wallets || []).map((w: any) => (
                     <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(139,92,246,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                           <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: w.is_default ? 'var(--purple)' : 'var(--text-muted)' }} />
                           <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{w.name}</span>
                           {w.is_default && <CheckCircle2 size={12} className="text-success" />}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 700 }}><span>Rp</span><span>{w.balance.toLocaleString('id-ID')}</span></span>
                          <button className="text-danger haptic-press" style={{ background: 'transparent' }} onClick={() => handleDeleteWallet(w.id, w.name)}>
                             <Trash2 size={14} />
                          </button>
                        </div>
                     </div>
                   ))}
                </div>
              )}
            </div>

            {data?.budgetAlerts?.length > 0 && (
              <div className="glass-card" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div className="card-icon bg-danger-dim"><PiggyBank size={16} /></div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Limit Anggaran!</div>
                  </div>
                </div>
                {data.budgetAlerts.map((b: any) => (
                  <div key={b.category_name} style={{ marginBottom: '1rem' }}>
                    <div className="progress-header">
                      <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{b.category_name}</span>
                      <span className={b.pct >= 100 ? 'text-danger' : 'text-warning'}>{b.pct}%</span>
                    </div>
                    <div className="progress-container" style={{ height: '6px' }}>
                      <div className={`progress-fill ${b.pct >= 100 ? 'danger' : 'warning'}`} style={{ width: `${Math.min(b.pct, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-title">⚡ Nabung Kilat</div>
            <div className="modal-desc">
              Masukkan dana cepat untuk <strong>{selectedTarget?.name ?? 'Target'}</strong>.
            </div>
            <div className="input-group" style={{ marginTop: '1rem' }}>
              <label className="input-label">Nominal (Rp)</label>
              <div className="input-wrapper">
                <CurrencyInput className="input-field" value={nabungAmt} onChange={setNabungAmt} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setModalOpen(false)}>Batal</button>
              <button className="btn btn-primary haptic-press" style={{ flex: 1 }} onClick={handleNabungKilat} disabled={saving || !nabungAmt}>
                {saving ? 'Menyimpan...' : 'Nabung Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}

      {walletModalOpen && (
        <div className="modal-overlay" onClick={() => setWalletModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-title">🏦 Tambah Dompet Baru</div>
            <div className="modal-desc">Pisahkan aset kamu agar lebih teratur (Cash, Bank, atau E-Wallet).</div>
            
            <div className="input-group">
               <label className="input-label">Nama Dompet</label>
               <div className="input-wrapper">
                  <input className="input-field" placeholder="Contoh: Bank Mandiri / GoPay" value={walletName} onChange={e => setWalletName(e.target.value)} />
               </div>
            </div>

            <div className="input-group" style={{ marginTop: '1rem' }}>
               <label className="input-label">Tipe Aset</label>
               <div className="input-wrapper">
                  <select className="input-field" value={walletType} onChange={e => setWalletType(e.target.value)}>
                    <option value="cash">Cash / Tunai</option>
                    <option value="bank">Bank / Rekening</option>
                    <option value="ewallet">E-Wallet / Digital</option>
                  </select>
               </div>
            </div>

            <div className="input-group" style={{ marginTop: '1rem' }}>
               <label className="input-label">Saldo Awal (Opsional)</label>
               <div className="input-wrapper">
                  <CurrencyInput className="input-field" value={walletBalance} onChange={setWalletBalance} />
               </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setWalletModalOpen(false)}>Batal</button>
              <button className="btn btn-primary haptic-press" style={{ flex: 1 }} onClick={handleCreateWallet} disabled={createWalletMutation.isPending}>
                {createWalletMutation.isPending ? 'Menambah...' : 'Simpan Dompet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showStreak && <StreakCelebration streak={streakCount} onClose={() => setShowStreak(false)} />}
    </>
  );
};

export default Dashboard;