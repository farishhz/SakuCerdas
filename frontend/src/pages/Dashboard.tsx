import { useState, useEffect } from 'react';
import { Wallet, Target as TargetIcon, Zap, ArrowUpRight, ArrowDownRight, PiggyBank, Flame, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { targetService, transactionService, budgetService } from '../lib/services';
import CurrencyInput from '../components/CurrencyInput';
import StreakCelebration from '../components/StreakCelebration';

const Dashboard = () => {
  const [modalOpen, setModalOpen]         = useState(false);
  const [nabungAmt, setNabungAmt]         = useState<number | ''>('');
  const [selectedTarget, setSelectedTarget] = useState<any>(null);
  
  const [userName, setUserName]           = useState('User');
  const [targets, setTargets]             = useState<any[]>([]);
  const [budgetAlerts, setBudgetAlerts]   = useState<any[]>([]);
  const [summary, setSummary]             = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [loading, setLoading]             = useState(true);
  const [saving, setSaving]               = useState(false);
  const [streak, setStreak]               = useState(0);

  // Streak Celebration
  const [showStreak, setShowStreak]       = useState(false);
  const [streakCount, setStreakCount]     = useState(0);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      if (profile?.full_name) setUserName(profile.full_name.split(' ')[0]);

      const s = await transactionService.getSummary();
      setSummary(s);

      // Ambil SEMUA target impian
      const allTargets = await targetService.getAll();
      if (allTargets && allTargets.length > 0) {
        // Sort by progress for slightly better visual priority
        const sorted = [...allTargets].sort((a, b) => {
          const pctA = a.current_amount / a.target_amount;
          const pctB = b.current_amount / b.target_amount;
          return pctB - pctA;
        });
        setTargets(sorted);
      } else {
        setTargets([]);
      }

      // Ambil Streak
      const { data: streakData } = await supabase
        .from('saving_streaks')
        .select('current_streak')
        .eq('user_id', user.id)
        .maybeSingle();
      if (streakData) setStreak(streakData.current_streak);

      // Ambil budget alerts
      const budgets = await budgetService.getAll();
      if (budgets) {
        const now = new Date();
        const expenses = await transactionService.getAll({
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          type: 'expense',
        });

        const alerts = budgets.map((b: any) => {
          const spent = expenses
            ?.filter((t: any) => t.category_id === b.category_id)
            .reduce((sum: number, t: any) => sum + t.amount, 0) ?? 0;
          return { ...b, spent, pct: Math.round((spent / b.limit_amount) * 100) };
        }).filter((b: any) => b.pct >= 80);

        setBudgetAlerts(alerts);
      }

      // Ambil streak
      const { data: sData } = await supabase.from('saving_streaks').select('current_streak').eq('user_id', user.id).maybeSingle();
      if (sData) setStreak(sData.current_streak);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleNabungKilat = async () => {
    if (!selectedTarget) return alert('Pilih target impian dulu ya!');
    if (!nabungAmt || nabungAmt <= 0) return alert('Masukkan nominal yang valid!');
    try {
      setSaving(true);
      const result = await targetService.deposit(selectedTarget.id, nabungAmt as number, 'Nabung Kilat from Dashboard');
      
      alert(`Berhasil nabung Rp${Number(nabungAmt).toLocaleString('id-ID')} untuk ${selectedTarget.name}!`);
      setModalOpen(false);
      setNabungAmt('');
      fetchAll();

      // Show Streak Celebration if incremented
      if (result.streakResult?.incremented) {
        setStreakCount(result.streakResult.newStreak);
        setShowStreak(true);
      }
    } catch (err: any) {
      console.error('Nabung kilat error:', err);
      alert(err.message || 'Gagal nabung. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const openNabung = (t: any) => {
    setSelectedTarget(t);
    setNabungAmt(50000);
    setModalOpen(true);
  };

  const stats = [
    { label: 'Saldo Bersih', value: `Rp${summary.balance.toLocaleString('id-ID')}`, icon: Wallet, change: '+12%', up: true },
    { label: 'Pemasukan Bulan Ini', value: `Rp${summary.totalIncome.toLocaleString('id-ID')}`, icon: ArrowDownRight, change: '+0%', up: true },
    { label: 'Pengeluaran Bulan Ini', value: `Rp${summary.totalExpense.toLocaleString('id-ID')}`, icon: ArrowUpRight, change: '-5%', up: false },
  ];

  return (
    <>
      <div className="animate-enter pb-8">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <div className="header-badge"><Zap size={12} /> Overview</div>
              <h1>Halo, {loading ? '...' : userName}! 👋</h1>
              <p>Ringkasan keuangan kamu per hari ini.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--accent-grad)', padding: '0.6rem 1.25rem', borderRadius: '1.25rem', color: 'white', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 24px rgba(139,92,246,0.25)' }}>
              <Flame size={20} color="#FFA500" fill="#FFA500" />
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, lineHeight: 1 }}>{streak} Hari</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>Saving Streak! 🔥</div>
              </div>
            </div>
          </div>
        
        {/* Stats */}
        <div className="dashboard-grid">
          {stats.map((s) => (
            <div key={s.label} className="glass-card">
              <div className="card-header" style={{ marginBottom: '1rem' }}>
                <div className="card-icon bg-dim"><s.icon size={18} /></div>
                <div style={{ flex: 1 }}><div className="card-title">{s.label}</div></div>
                <span className="tag" style={{ background: s.up ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: s.up ? '#22C55E' : '#EF4444' }}>{s.change}</span>
              </div>
              <div className="card-value">{loading ? '...' : s.value}</div>
            </div>
          ))}
          
          {/* Literacy Card */}
          <div className="glass-card" style={{ background: 'var(--accent-grad-soft)', borderColor: 'rgba(139,92,246,0.2)' }}>
            <div className="card-header" style={{ marginBottom: '0.75rem' }}>
              <div className="card-icon bg-purple"><Newspaper size={18} /></div>
              <div style={{ flex: 1 }}><div className="card-title">Literasi Finansial</div></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>Wawasan Baru</div>
                <p className="text-muted" style={{ fontSize: '0.75rem' }}>Update berita & strategi ekonomi.</p>
              </div>
              <Link to="/kesehatan" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                Baca Berita
              </Link>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', alignItems: 'start', marginTop: '1rem' }}>
          
          {/* Kolom Kiri: Target Impian */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <div className="card-title">Daftar Target Aktif</div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '0.2rem' }}>Target Impian</h3>
              </div>
              <div className="card-icon bg-dim"><TargetIcon size={18} /></div>
            </div>
            
            {targets.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {targets.map(t => {
                  const pct = Math.min(100, Math.round((t.current_amount / t.target_amount) * 100));
                  const done = pct >= 100 || t.is_completed;
                  return (
                    <div key={t.id} style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</span>
                         {!done && (
                           <button className="btn btn-ghost" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => openNabung(t)}>
                             <Zap size={12} /> Nabung
                           </button>
                         )}
                      </div>
                      <div className="progress-header" style={{ marginTop: '0.5rem' }}>
                        <span className="text-muted" style={{ fontSize: '0.82rem' }}>
                          Rp{t.current_amount.toLocaleString('id-ID')} / Rp{t.target_amount.toLocaleString('id-ID')}
                        </span>
                        <span style={{ fontWeight: 700, color: done ? 'var(--success)' : '' }}>{pct}%</span>
                      </div>
                      <div className="progress-container">
                        <div className={`progress-fill ${done ? 'success' : ''}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Yuk buat target impian pertamamu di menu Target!</p>
            )}
          </div>

          {/* Kolom Kanan: Budget Alerts */}
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
                <div key={b.id} style={{ marginBottom: '0.875rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                  <div className="progress-header">
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{b.categories?.name ?? 'Kategori'}</span>
                    <span className={b.pct > 100 ? 'text-danger' : 'text-warning'} style={{ fontWeight: 700 }}>{b.pct}%</span>
                  </div>
                  <div className="progress-container">
                    <div className={`progress-fill ${b.pct > 100 ? 'danger' : 'warning'}`} style={{ width: `${Math.min(b.pct, 100)}%` }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Rp{b.spent.toLocaleString('id-ID')} / Rp{b.limit_amount.toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nabung Kilat Modal */}
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
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleNabungKilat} disabled={saving || !nabungAmt}>
                {saving ? 'Menyimpan...' : 'Nabung Sekarang'}
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