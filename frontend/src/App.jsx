import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import GoalsPage from './pages/GoalsPage';
import PortfolioPage from './pages/PortfolioPage';
import AchievementsPage from './pages/AchievementsPage';
import AppShell from './components/layout/AppShell';

function App() {
  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
        </Routes>
      </AppShell>
    </Router>
  );
}

export default App;
