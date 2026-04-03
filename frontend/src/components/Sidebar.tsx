import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Target, TrendingUp, History, User, LogOut, PiggyBank, ShieldCheck, Heart, Repeat, CreditCard, Calendar, Newspaper } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Sidebar = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{full_name: string, level: string} | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('profiles').select('full_name, level').eq('id', user.id).single()
          .then(({ data }) => setProfile(data));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase.from('profiles').select('full_name, level').eq('id', session.user.id).single()
          .then(({ data }) => setProfile(data));
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon" style={{ background: 'transparent', padding: 0 }}>
          <img src="/logo.png" alt="SakuCerdas" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />
        </div>
        <span className="brand-title">SakuCerdas</span>
      </div>
      <div className="sidebar-user-card">
        <div className="sidebar-avatar">{getInitials(profile?.full_name)}</div>
        <div className="sidebar-user-info">
          <p>{profile?.full_name || 'Pengguna Baru'}</p>
          <p>{profile?.level || 'Newbie'}</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section-title">Utama</div>
        {[
          { path: '/dashboard', icon: Home, label: 'Dashboard' },
          { path: '/target-impian', icon: Target, label: 'Target Impian' },
          { path: '/simulasi-investasi', icon: TrendingUp, label: 'Simulasi Investasi' },
          { path: '/riwayat', icon: History, label: 'Riwayat Transaksi' },
        ].map(({ path, icon: Icon, label }) => (
          <NavLink key={path} to={path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={16} /><span>{label}</span>
          </NavLink>
        ))}
        <div className="nav-section-title">Perencanaan</div>
        {[
          { path: '/budget', icon: PiggyBank, label: 'Budget Kategori' },
          { path: '/dana-darurat', icon: ShieldCheck, label: 'Dana Darurat' },
          { path: '/zakat', icon: Heart, label: 'Zakat Maal' },
          { path: '/rutin', icon: Repeat, label: 'Sub & Rutin' },
          { path: '/hutang', icon: CreditCard, label: 'Hutang & Piutang' },
          { path: '/kalender', icon: Calendar, label: 'Kalender Finansial' },
          { path: '/kesehatan', icon: Newspaper, label: 'Literasi Keuangan' },
        ].map(({ path, icon: Icon, label }) => (
          <NavLink key={path} to={path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={16} /><span>{label}</span>
          </NavLink>
        ))}
        <div className="nav-section-title">Akun</div>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={16} /><span>Profil Saya</span>
        </NavLink>
      </nav>
      <div className="sidebar-footer" style={{ padding: '0.5rem 0.5rem 1rem 0.5rem', borderTop: '1px solid var(--border)' }}>
        <ThemeToggle />
        <button onClick={() => navigate('/')} className="logout-btn" style={{ marginTop: '0.5rem', width: 'auto', margin: '0 0.5rem' }}>
          <LogOut size={15} /><span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
