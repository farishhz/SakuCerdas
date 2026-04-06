import { useState, useEffect } from 'react';
import { User, Mail, Phone, Settings, Shield, Monitor, Smartphone, Award } from 'lucide-react';
import { bffService, authService } from '../lib/services';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { supabase } from '../lib/supabase';

type ProfileData = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  xp: number;
  level: string;
  created_at: string;
};

type BadgeItem = {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  earned?: boolean;
};

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [profileModal, setProfileModal] = useState(false);
  const [pwModal, setPwModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPw, setEditPw] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [pResult, bResult, lResult] = await Promise.all([
          bffService.getProfile(),
          bffService.getBadges(),
          bffService.getActivityLogs(3)
        ]);

        if (pResult.data) {
          setProfile(pResult.data);
          setEditName(pResult.data.full_name || '');
          setEditPhone(pResult.data.phone || '');
        }
        setBadges(bResult.data || []);
        setLogs(lResult.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    try {
      if (!window.confirm('Yakin ingin keluar?')) return;
      await authService.logout();
      window.location.href = '/login';
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    try {
      setSaving(true);
      await bffService.updateProfile(editName, editPhone);
      setProfile({ ...profile, full_name: editName, phone: editPhone });
      setProfileModal(false);
      alert('Profil berhasil diperbarui!');
    } catch (err) {
      console.error(err);
      alert('Gagal update profil');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (editPw.length < 8) return alert('Kata sandi minimal 8 karakter');
    try {
      setSaving(true);
      const { error } = await supabase.auth.updateUser({ password: editPw });
      if (error) throw error;
      setPwModal(false);
      setEditPw('');
      alert('Kata sandi berhasil diperbarui!');
    } catch (err) {
      console.error(err);
      alert('Gagal update kata sandi');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setSaving(true);
      await authService.deleteAccount();
      alert('Akun Anda telah berhasil dihapus. Sampai jumpa lagi!');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Gagal menghapus akun');
    } finally {
      setSaving(false);
    }
  };

  const maxXp = 1000;

  if (loading) {
     return <div className="animate-enter pb-8"><div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Memuat Profil...</div></div>;
  }

  return (
    <div className="animate-enter pb-8">
      <div className="top-header">
        <div>
          <div className="header-badge"><User size={12} /> Akun</div>
          <h1>Profil Saya</h1>
          <p>Kelola akun dan pantau pencapaianmu.</p>
        </div>
        <button className="btn btn-ghost text-danger" onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.1)' }}>
          Logout
        </button>
      </div>

      <div className="glass-card" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <User size={36} style={{ color: 'var(--text)' }} />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.03em', marginBottom: '0.25rem' }}>{profile?.full_name || 'Pengguna Baru'}</h2>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="tag tag-default">Member sejak {profile?.created_at ? new Date(profile.created_at).getFullYear() : 2023}</span>
            <span className="tag tag-success">{profile?.level || 'Newbie'}</span>
          </div>
        </div>
        <div style={{ minWidth: '200px', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.375rem', fontWeight: 600 }}>
            <span><Award size={12} style={{ display: 'inline', marginRight: '4px' }} />{profile?.level || 'Newbie'}</span>
            <span>{profile?.xp || 0} / {maxXp} XP</span>
          </div>
          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${Math.min(((profile?.xp || 0) / maxXp) * 100, 100)}%`, background: 'var(--purple)' }} />
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '1rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="icon-box"><Mail size={16} /></div>
          <div><div className="card-title">Email</div><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{profile?.email}</div></div>
        </div>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="icon-box"><Phone size={16} /></div>
          <div><div className="card-title">Nomor HP</div><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{profile?.phone || 'Belum diatur'}</div></div>
        </div>
        <button className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', cursor: 'pointer' }} onClick={() => setProfileModal(true)}>
          <div className="icon-box"><Settings size={16} /></div>
          <div><div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Pengaturan Akun</div><div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Ubah nama & no HP</div></div>
        </button>
        <button className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', cursor: 'pointer' }} onClick={() => setPwModal(true)}>
          <div className="icon-box"><Shield size={16} /></div>
          <div><div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Keamanan</div><div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Ubah kata sandi</div></div>
        </button>
      </div>

      <div className="glass-card" style={{ marginBottom: '1rem' }}>
        <div style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.95rem' }}>🏆 Badge & Pencapaian</div>
        {badges.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {badges.map(b => (
              <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem', borderRadius: '0.75rem', background: b.earned ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${b.earned ? 'rgba(255,255,255,0.12)' : 'var(--border)'}`, opacity: b.earned ? 1 : 0.45 }}>
                <div style={{ fontSize: '1.75rem', lineHeight: 1 }}>{b.icon || '🏅'}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{b.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{b.description || 'Pencapaian khusus'}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Daftar Badge Belum Tersedia.</div>
        )}
      </div>

      <div className="glass-card">
        <div style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.95rem' }}>🔒 Riwayat Aktivitas & Login</div>
        {logs.length > 0 ? (
          logs.map((log, i) => {
            const isMobile = log.device?.toLowerCase().includes('mobile');
            const IconComp = isMobile ? Smartphone : Monitor;
            return (
              <div key={log.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: i < logs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div className="icon-box"><IconComp size={15} /></div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{log.device || 'Perangkat Tidak Dikenal'}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>IP: {log.ip_address || 'Lokal'} · {new Date(log.created_at).toLocaleString('id-ID')}</div>
                  </div>
                </div>
                {i === 0 
                  ? <span className="tag tag-success">Sesi Ini</span>
                  : <span className="tag tag-default">Selesai</span>}
              </div>
            )
          })
        ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Belum ada log aktivitas.</div>
        )}
      </div>

      <div className="glass-card" style={{ marginTop: '1rem' }}>
        <ThemeToggle />
      </div>

      <div style={{ marginTop: '2rem', padding: '0 0.5rem' }}>
        <button 
          className="btn btn-ghost" 
          style={{ width: '100%', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)', justifyContent: 'center' }}
          onClick={() => setDeleteModal(true)}
        >
          Hapus Akun Permanen
        </button>
      </div>

      {profileModal && (
        <div className="modal-overlay" onClick={() => setProfileModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Ubah Profil</div>
            <div className="modal-desc">Sesuaikan nama lengkap dan kontakmu.</div>
            
            <div className="input-group">
              <label className="input-label">Nama Lengkap</label>
              <div className="input-wrapper">
                <input type="text" className="input-field" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
            </div>
            
            <div className="input-group">
              <label className="input-label">Nomor HP</label>
              <div className="input-wrapper">
                <input type="tel" className="input-field" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setProfileModal(false)}>Batal</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSaveProfile} disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {pwModal && (
        <div className="modal-overlay" onClick={() => setPwModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Keamanan</div>
            <div className="modal-desc">Ubah kata sandi akunmu.</div>
            
            <div className="input-group">
              <label className="input-label">Kata Sandi Baru</label>
              <div className="input-wrapper">
                <input type="password" placeholder="Minimal 8 karakter" className="input-field" value={editPw} onChange={(e) => setEditPw(e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setPwModal(false)}>Batal</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSavePassword} disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="modal-overlay" onClick={() => setDeleteModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ borderColor: 'rgba(239,68,68,0.4)' }}>
            <div className="modal-title" style={{ color: '#EF4444' }}>Hapus Akun Permanen?</div>
            <div className="modal-desc">
              Tindakan ini tidak dapat dibatalkan. Seluruh data transaksi, target impian, dan pencapaian Anda akan dihapus selamanya dari server SakuCerdas.
            </div>
            
            <div style={{ background: 'rgba(239,68,68,0.08)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', border: '1px solid rgba(239,68,68,0.15)' }}>
              <p style={{ fontSize: '0.8rem', color: '#EF4444', fontWeight: 600, textAlign: 'center' }}>
                Apakah Anda yakin ingin meninggalkan SakuCerdas?
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDeleteModal(false)}>Batal</button>
              <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={handleDeleteAccount} disabled={saving}>
                {saving ? 'Menghapus...' : 'Ya, Hapus Akun'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default Profile;
