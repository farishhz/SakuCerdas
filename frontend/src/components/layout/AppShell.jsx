import React from 'react';
import Navbar from '../common/Navbar';

const AppShell = ({ children }) => (
  <div className="app-shell">
    <Navbar />
    <main className="container mt-4">
      {children}
    </main>
  </div>
);

export default AppShell;
