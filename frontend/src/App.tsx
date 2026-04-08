import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Zakat from './pages/Zakat';

// Lazy-load every page so one bad module can't crash the whole app
const LandingPage      = lazy(() => import('./pages/LandingPage'));
const Login            = lazy(() => import('./pages/Login'));
const Register         = lazy(() => import('./pages/Register'));
const Dashboard        = lazy(() => import('./pages/Dashboard'));
const TargetImpian     = lazy(() => import('./pages/TargetImpian'));
const SimulasiInvestasi = lazy(() => import('./pages/SimulasiInvestasi'));
const Riwayat          = lazy(() => import('./pages/Riwayat'));
const Profile          = lazy(() => import('./pages/Profile'));
const Budget           = lazy(() => import('./pages/Budget'));
const DanaDarurat      = lazy(() => import('./pages/DanaDarurat'));
const Sidebar          = lazy(() => import('./components/Sidebar'));
const BottomNav        = lazy(() => import('./components/BottomNav'));
const RecurringTransactions = lazy(() => import('./pages/RecurringTransactions'));
const DebtLoans        = lazy(() => import('./pages/DebtLoans'));
const FinancialLiteracy = lazy(() => import('./pages/FinancialHealth'));
const FinancialCalendar = lazy(() => import('./pages/FinancialCalendar'));

const PageLoader = () => (
  <div className="premium-loader-container">
    <div className="premium-loader-logo">
      <img src="/logo.png" alt="SakuCerdas" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
    </div>
    <div style={{ marginBottom: '1.5rem', fontWeight: 800, fontSize: '1.2rem' }} className="brand-title">
      SakuCerdas
    </div>
    <div className="loader-progress-track">
      <div className="loader-progress-bar"></div>
    </div>
  </div>
);

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login', { replace: true });
      }
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate('/login', { replace: true });
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) return <PageLoader />;

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
};

function App() {
  React.useEffect(() => {
    const defaultTheme = localStorage.getItem('theme') || 'sakucerdas';
    document.documentElement.setAttribute('data-theme', defaultTheme);
  }, []);

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"                    element={<LandingPage />} />
          <Route path="/login"               element={<Login />} />
          <Route path="/register"            element={<Register />} />
          <Route path="/dashboard"           element={<AuthLayout><Dashboard /></AuthLayout>} />
          <Route path="/target-impian"       element={<AuthLayout><TargetImpian /></AuthLayout>} />
          <Route path="/simulasi-investasi"  element={<AuthLayout><SimulasiInvestasi /></AuthLayout>} />
          <Route path="/riwayat"             element={<AuthLayout><Riwayat /></AuthLayout>} />
          <Route path="/profile"             element={<AuthLayout><Profile /></AuthLayout>} />
          <Route path="/budget"              element={<AuthLayout><Budget /></AuthLayout>} />
          <Route path="/dana-darurat"        element={<AuthLayout><DanaDarurat /></AuthLayout>} />
          <Route path="/zakat"               element={<AuthLayout><Zakat /></AuthLayout>} />
          <Route path="/rutin"               element={<AuthLayout><RecurringTransactions /></AuthLayout>} />
          <Route path="/hutang"              element={<AuthLayout><DebtLoans /></AuthLayout>} />
          <Route path="/kesehatan"           element={<AuthLayout><FinancialLiteracy /></AuthLayout>} />
          <Route path="/kalender"            element={<AuthLayout><FinancialCalendar /></AuthLayout>} />
          <Route path="*"                    element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
export default App;
