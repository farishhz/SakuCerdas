import { useState, useEffect } from 'react';
import { Wallet, Target as TargetIcon, Zap, ArrowUpRight, ArrowDownRight, PiggyBank } from 'lucide-react';

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [nabungAmt, setNabungAmt] = useState(250000);

  // State untuk menyimpan data asli dari database
  const [userName, setUserName] = useState('User');
  const [targets, setTargets] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [totalSaldo, setTotalSaldo] = useState(0);
  const [nearestTarget, setNearestTarget] = useState<any>(null);

  // Fungsi untuk menarik data dari Backend Galen
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('sakuToken');
      const userStr = localStorage.getItem('sakuUser');
      
      if (userStr) {
        setUserName(JSON.parse(userStr).name.split(' ')[0]); // Ambil nama panggilan aja
      }

      if (!token) return;

      // 1. Ambil data Tabungan (Targets)
      const resTargets = await fetch('http://localhost:8000/targets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dataTargets = await resTargets.json();

      if (dataTargets.status === 'success') {
        const fetchedTargets = dataTargets.data;
        setTargets(fetchedTargets);

        // Hitung total saldo dari semua tabungan
        const total = fetchedTargets.reduce((sum: number, t: any) => sum + t.currentAmount, 0);
        setTotalSaldo(total);

        // Cari target yang paling dekat pencapaiannya (persentase tertinggi)
        if (fetchedTargets.length > 0) {
          const sortedTargets = [...fetchedTargets].sort((a, b) => {
            const pctA = a.currentAmount / a.targetAmount;
            const pctB = b.currentAmount / b.targetAmount;
            return pctB - pctA; // Urutkan dari persentase terbesar
          });
          setNearestTarget(sortedTargets[0]);
        }
      }

      // 2. Ambil data Budget
      const resBudgets = await fetch('http://localhost:8000/budgets', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dataBudgets = await resBudgets.json();
      
      if (dataBudgets.status === 'success') {
        setBudgets(dataBudgets.data);
      }

    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    }
  };

  // Jalankan fetch saat halaman pertama kali dimuat
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fungsi eksekusi Nabung Kilat ke Backend
  const handleNabungKilat = async () => {
    if (!nearestTarget) return alert('Buat target impian dulu ya!');
    
    try {
      const token = localStorage.getItem('sakuToken');
      const response = await fetch('http://localhost:8000/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          targetId: nearestTarget._id,
          amount: nabungAmt,
          description: 'Nabung Kilat dari Dashboard'
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        alert(`Yeay! Berhasil nabung Rp${nabungAmt.toLocaleString('id-ID')} buat ${nearestTarget.title}!`);
        setModalOpen(false);
        fetchDashboardData(); // Refresh data supaya grafik langsung naik!
      }
    } catch (error) {
      console.error("Gagal nabung:", error);
    }
  };

  // --- Data Stats Dinamis (Pemasukan/Pengeluaran sementara statis sampai ada fitur rekap) ---
  const stats = [
    { label: 'Total Saldo', value: `Rp${totalSaldo.toLocaleString('id-ID')}`, icon: Wallet, change: '+12%', up: true },
    { label: 'Pemasukan Bulan Ini', value: 'Rp8.000.000', icon: ArrowDownRight, change: '+0%', up: true },
    { label: 'Pengeluaran Bulan Ini', value: 'Rp1.188.000', icon: ArrowUpRight, change: '-5%', up: false },
  ];

  return (
    <div className="animate-enter pb-8">
      <div className="top-header">
        <div>
          <div className="header-badge"><Zap size={12} /> Overview</div>
          {/* NAMA USER OTOMATIS */}
          <h1>Halo, {userName}! 👋</h1>
          <p>Ringkasan keuangan kamu per hari ini.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Zap size={15} fill="currentColor" /> Nabung Kilat
        </button>
      </div>

      {/* Stats */}
      <div className="dashboard-grid">
        {stats.map((s) => (
          <div key={s.label} className="glass-card">
            <div className="card-header" style={{ marginBottom: '1rem' }}>
              <div className="card-icon bg-dim"><s.icon size={18} /></div>
              <div style={{ flex: 1 }}>
                <div className="card-title">{s.label}</div>
              </div>
              <span className="tag" style={{ background: s.up ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: s.up ? '#22C55E' : '#EF4444' }}>{s.change}</span>
            </div>
            <div className="card-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Target Terdekat (Otomatis ngambil dari MongoDB) */}
      <div className="glass-card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div className="card-title">Target Terdekat</div>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '0.2rem' }}>
              {nearestTarget ? nearestTarget.title : 'Belum ada target'}
            </h3>
          </div>
          <div className="card-icon bg-dim"><TargetIcon size={18} /></div>
        </div>
        
        {nearestTarget ? (
          <>
            <div className="progress-header">
              <span className="text-muted" style={{ fontSize: '0.82rem' }}>
                Rp{nearestTarget.currentAmount.toLocaleString('id-ID')} / Rp{nearestTarget.targetAmount.toLocaleString('id-ID')}
              </span>
              <span style={{ fontWeight: 700 }}>
                {Math.round((nearestTarget.currentAmount / nearestTarget.targetAmount) * 100)}%
              </span>
            </div>
            <div className="progress-container">
              <div 
                className="progress-fill success" 
                style={{ width: `${Math.min(100, Math.round((nearestTarget.currentAmount / nearestTarget.targetAmount) * 100))}%` }} 
              />
            </div>
          </>
        ) : (
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>Yuk buat target impian pertamamu di menu Target!</p>
        )}
      </div>

      {/* Budget Alerts (Dinamis) */}
      {budgets.length > 0 && (
        <div className="glass-card" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div className="card-icon bg-danger"><PiggyBank size={16} /></div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Status Budget</div>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>Pantau pengeluaranmu bulan ini.</div>
            </div>
          </div>
          {budgets.map((b) => {
            const usedPercentage = Math.round((b.spentAmount / b.limitAmount) * 100);
            return (
              <div key={b._id} style={{ marginBottom: '0.875rem' }}>
                <div className="progress-header">
                  <span style={{ fontSize: '0.82rem' }}>{b.category}</span>
                  <span className={usedPercentage >= 100 ? 'text-danger' : 'text-warning'} style={{ fontWeight: 700 }}>
                    {usedPercentage}%
                  </span>
                </div>
                <div className="progress-container">
                  <div className={`progress-fill ${usedPercentage >= 100 ? 'danger' : 'warning'}`} style={{ width: `${Math.min(usedPercentage, 100)}%` }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Rp{b.spentAmount.toLocaleString('id-ID')} / Rp{b.limitAmount.toLocaleString('id-ID')}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Nabung Kilat Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-title">⚡ Nabung Kilat</div>
            <div className="modal-desc">
              Masukkan dana cepat untuk target terdekatmu ({nearestTarget?.title || 'Target'}).
            </div>
            <div className="input-group" style={{ marginTop: '1rem' }}>
              <label className="input-label">Nominal Nabung (Rp)</label>
              <div className="input-wrapper">
                <input type="number" className="input-field" value={nabungAmt} onChange={e => setNabungAmt(+e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setModalOpen(false)}>Batal</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleNabungKilat}>Nabung Sekarang</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;