import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#080808', color: '#F2F2F2', fontFamily: 'Inter, sans-serif',
          flexDirection: 'column', gap: '1rem', padding: '2rem', textAlign: 'center',
        }}>
          <div style={{ fontSize: '2.5rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Terjadi kesalahan saat memuat aplikasi</h1>
          <pre style={{
            background: '#111', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '0.75rem', padding: '1rem', fontSize: '0.78rem',
            color: '#EF4444', maxWidth: '640px', overflowX: 'auto', textAlign: 'left',
          }}>
            {this.state.error.message}
            {'\n'}
            {this.state.error.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '0.625rem 1.5rem', background: 'white', color: '#080808', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Muat ulang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
