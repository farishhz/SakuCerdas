import { NavLink } from 'react-router-dom';
import { Home, Target, TrendingUp, User, PiggyBank, History, ShieldCheck, Heart, Repeat, CreditCard, Calendar, Activity } from 'lucide-react';

const BottomNav = () => (
  <div className="bottom-nav-wrapper">
    <div className="bottom-nav">
      {[
        { path: '/dashboard', icon: Home, label: 'Dasbor' },
        { path: '/target-impian', icon: Target, label: 'Target' },
        { path: '/simulasi-investasi', icon: TrendingUp, label: 'Simulasi' },
        { path: '/riwayat', icon: History, label: 'Riwayat' },
        { path: '/budget', icon: PiggyBank, label: 'Budget' },
        { path: '/dana-darurat', icon: ShieldCheck, label: 'Darurat' },
        { path: '/zakat', icon: Heart, label: 'Zakat' },
        { path: '/rutin', icon: Repeat, label: 'Rutin' },
        { path: '/hutang', icon: CreditCard, label: 'Hutan' },
        { path: '/kalender', icon: Calendar, label: 'Kalender' },
        { path: '/kesehatan', icon: Activity, label: 'Audit' },
        { path: '/profile', icon: User, label: 'Profil' },
      ].map(({ path, icon: Icon, label }) => (
        <NavLink key={path} to={path} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
          <Icon size={20} />
          <span className="nav-label">{label}</span>
        </NavLink>
      ))}
    </div>
  </div>
);
export default BottomNav;
