import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

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

const PageLoader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', background: '#080808',
  }}>
    <div style={{
      width: '32px', height: '32px', border: '2px solid rgba(255,255,255,0.1)',
      borderTopColor: 'white', borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
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
          <Route path="*"                    element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
export default App;
