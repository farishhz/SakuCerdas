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
          display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw',
          background: 'var(--bg)', color: 'var(--text)', fontFamily: 'Inter, sans-serif',
          flexDirection: 'column', gap: '1.5rem', padding: '2rem', textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Terjadi kesalahan saat memuat aplikasi</h1>
          <div style={{
            maxWidth: '500px', padding: '2rem', borderRadius: '1rem',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
          }}>
            <pre style={{
              fontSize: '0.78rem',
              color: '#EF4444', overflowX: 'auto', textAlign: 'left', margin: 0
            }}>
              {this.state.error.message}
              {'\n'}
              {this.state.error.stack}
            </pre>
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '0.625rem 1.5rem', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
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
