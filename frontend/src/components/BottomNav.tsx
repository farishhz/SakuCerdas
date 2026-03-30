import { NavLink } from 'react-router-dom';
import { Home, Target, TrendingUp, User, PiggyBank } from 'lucide-react';

const BottomNav = () => (
  <div className="bottom-nav">
    {[
      { path: '/dashboard', icon: Home },
      { path: '/target-impian', icon: Target },
      { path: '/budget', icon: PiggyBank },
      { path: '/simulasi-investasi', icon: TrendingUp },
      { path: '/profile', icon: User },
    ].map(({ path, icon: Icon }) => (
      <NavLink key={path} to={path} className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <Icon size={20} />
      </NavLink>
    ))}
  </div>
);
export default BottomNav;
