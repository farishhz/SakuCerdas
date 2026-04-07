import { NavLink } from 'react-router-dom';
import { Home, Target, TrendingUp, User, PiggyBank, History, ShieldCheck, Heart, Repeat, CreditCard, Calendar, Newspaper } from 'lucide-react';

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
        { path: '/hutang', icon: CreditCard, label: 'Hutang' },
        { path: '/kalender', icon: Calendar, label: 'Kalender' },
        { path: '/kesehatan', icon: Newspaper, label: 'Literasi' },
        { path: '/profile', icon: User, label: 'Profil' },
      ].map(({ path, icon: Icon, label }) => (
        <NavLink key={path} to={path} className={({ isActive }) => `bottom-nav-item haptic-press ${isActive ? 'active' : ''}`}>
          {({ isActive }) => (
            <>
              <Icon size={20} strokeWidth={isActive ? 3 : 2} />
              <span className="nav-label">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  </div>
);
export default BottomNav;
