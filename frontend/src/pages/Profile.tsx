import { User, Mail, Phone, Settings, Shield, Monitor, Smartphone, Award } from 'lucide-react';

const badges = [
  { icon: '🔥', name: 'Streak 7 Hari', desc: 'Nabung 7 hari berturut-turut', earned: true },
  { icon: '🎯', name: 'Target Pertama', desc: 'Berhasil menyelesaikan 1 target', earned: true },
  { icon: '💎', name: 'Wealth Master', desc: 'Total aset mencapai Rp100 Juta', earned: false },
  { icon: '📊', name: 'Analis Handal', desc: 'Lihat laporan 10x berturut-turut', earned: false },
];

const activityLog = [
  { device: 'Chrome · Windows', ip: '114.10.xx.xx', time: '30 Mar 2026, 17:45', icon: Monitor, current: true },
  { device: 'Safari · iPhone 14', ip: '114.10.xx.xx', time: '29 Mar 2026, 08:12', icon: Smartphone, current: false },
  { device: 'Chrome · Windows', ip: '180.244.xx.xx', time: '27 Mar 2026, 21:03', icon: Monitor, current: false },
];

const Profile = () => {
  const xp = 620;
  const maxXp = 1000;
  const level = 'Hemat Ranger';
  const nextLevel = 'Wealth Master';

  return (
    <div className="animate-enter pb-8">
      <div className="top-header">
        <div>
          <div className="header-badge"><User size={12} /> Akun</div>
          <h1>Profil Saya</h1>
          <p>Kelola akun dan pantau pencapaianmu.</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="glass-card" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '1rem', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <User size={36} color="#080808" />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>John Doe</h2>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="tag tag-default">Member sejak 2023</span>
            <span className="tag tag-success">{level}</span>
          </div>
        </div>
        <div style={{ minWidth: '200px', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.375rem', fontWeight: 600 }}>
            <span><Award size={12} style={{ display: 'inline', marginRight: '4px' }} />{level}</span>
            <span>{xp} / {maxXp} XP → {nextLevel}</span>
          </div>
          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${(xp / maxXp) * 100}%`, background: 'white' }} />
          </div>
        </div>
      </div>

      {/* Info + Actions */}
      <div className="dashboard-grid" style={{ marginBottom: '1rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="icon-box"><Mail size={16} /></div>
          <div><div className="card-title">Email</div><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>john@example.com</div></div>
        </div>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="icon-box"><Phone size={16} /></div>
          <div><div className="card-title">WhatsApp</div><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>0812-3456-7890</div></div>
        </div>
        <button className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', cursor: 'pointer' }}>
          <div className="icon-box"><Settings size={16} /></div>
          <div><div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Pengaturan Akun</div><div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Password & notifikasi</div></div>
        </button>
        <button className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', cursor: 'pointer' }}>
          <div className="icon-box"><Shield size={16} /></div>
          <div><div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Keamanan</div><div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>2FA & perangkat</div></div>
        </button>
      </div>

      {/* Badges */}
      <div className="glass-card" style={{ marginBottom: '1rem' }}>
        <div style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.95rem' }}>🏆 Badge & Pencapaian</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {badges.map(b => (
            <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem', borderRadius: '0.75rem', background: b.earned ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${b.earned ? 'rgba(255,255,255,0.12)' : 'var(--border)'}`, opacity: b.earned ? 1 : 0.45 }}>
              <div style={{ fontSize: '1.75rem', lineHeight: 1 }}>{b.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{b.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Log */}
      <div className="glass-card">
        <div style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.95rem' }}>🔒 Riwayat Login</div>
        {activityLog.map((log, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: i < activityLog.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div className="icon-box"><log.icon size={15} /></div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{log.device}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>IP {log.ip} · {log.time}</div>
              </div>
            </div>
            {log.current
              ? <span className="tag tag-success">Sesi Ini</span>
              : <span className="tag tag-default">Selesai</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Profile;
