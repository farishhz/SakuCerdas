import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Wallet, AlertCircle } from 'lucide-react';
import { authService } from '../lib/services';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login gagal.';
      if (msg.includes('Invalid login credentials')) {
        setError('Email atau kata sandi salah.');
      } else if (msg.includes('Email not confirmed')) {
        setError('Cek inbox email kamu untuk konfirmasi akun terlebih dahulu.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.015) 0%, transparent 50%)', pointerEvents: 'none' }} />
      <div className="auth-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={14} color="#080808" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>SakuCerdas</span>
        </div>

        <div className="auth-header">
          <h1>Selamat datang kembali</h1>
          <p>Masukkan kredensial untuk melanjutkan.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={16} />
              <input
                type="email" className="input-field"
                placeholder="nama@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                required disabled={loading}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Kata Sandi</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={16} />
              <input
                type="password" className="input-field"
                placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                required disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.625rem', padding: '0.75rem', marginBottom: '1rem' }}>
              <AlertCircle size={15} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '1px' }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--danger)', fontWeight: 500 }}>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.25rem' }}
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="auth-footer">
          Belum punya akun?{' '}
          <button className="auth-link" onClick={() => navigate('/register')}>
            Daftar sekarang
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;
