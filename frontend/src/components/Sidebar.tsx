import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Target, TrendingUp, History, User, LogOut, PiggyBank, ShieldCheck } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon" style={{ background: 'transparent', padding: 0 }}>
          <img src="/logo.png" alt="SakuCerdas" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />
        </div>
        <span className="brand-title">SakuCerdas</span>
      </div>
      <div className="sidebar-user-card">
        <div className="sidebar-avatar">JD</div>
        <div className="sidebar-user-info">
          <p>John Doe</p>
          <p>Hemat Ranger · Lv.2</p>
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
      <div className="sidebar-footer">
        <button onClick={() => navigate('/')} className="logout-btn">
          <LogOut size={15} /><span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
