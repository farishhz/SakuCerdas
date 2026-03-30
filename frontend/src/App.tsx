import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TargetImpian from './pages/TargetImpian';
import SimulasiInvestasi from './pages/SimulasiInvestasi';
import Riwayat from './pages/Riwayat';
import Profile from './pages/Profile';
import Budget from './pages/Budget';
import DanaDarurat from './pages/DanaDarurat';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="app-container">
    <div className="content-wrapper">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
    <BottomNav />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<AuthLayout><Dashboard /></AuthLayout>} />
        <Route path="/target-impian" element={<AuthLayout><TargetImpian /></AuthLayout>} />
        <Route path="/simulasi-investasi" element={<AuthLayout><SimulasiInvestasi /></AuthLayout>} />
        <Route path="/riwayat" element={<AuthLayout><Riwayat /></AuthLayout>} />
        <Route path="/profile" element={<AuthLayout><Profile /></AuthLayout>} />
        <Route path="/budget" element={<AuthLayout><Budget /></AuthLayout>} />
        <Route path="/dana-darurat" element={<AuthLayout><DanaDarurat /></AuthLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
export default App;
