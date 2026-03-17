import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
    <Link className="navbar-brand fw-bold" to="/">SakuCerdas</Link>
    <div className="collapse navbar-collapse">
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/goals">Goals</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/portfolio">Portfolio</Link></li>
        <li className="nav-item"><Link className="nav-link" to="/achievements">Achievements</Link></li>
      </ul>
    </div>
  </nav>
);

export default Navbar;
