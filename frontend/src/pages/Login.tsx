import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertTriangle } from 'lucide-react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, firebaseConfigured } from '../lib/firebase';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  /* ── Email / Password login ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!firebaseConfigured || !auth) {
      setError('Firebase belum dikonfigurasi. Isi file .env terlebih dahulu.');
      return;
    }
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: result.user.email,
        })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('sakuToken', data.token);
        localStorage.setItem('sakuUser', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError('Gagal mendapatkan akses dari server lokal.');
      }
    } catch {
      setError('Email atau kata sandi salah.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Google login ── */
  const handleGoogleLogin = async () => {
    setError('');
    if (!firebaseConfigured || !auth) {
      setError('Firebase belum dikonfigurasi. Isi file .env terlebih dahulu.');
      return;
    }
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const response = await fetch('http://localhost:8000/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('sakuToken', data.token);
        localStorage.setItem('sakuUser', JSON.stringify(data.user));

        navigate('/dashboard');
      } else {
        setError('Gagal sinkronisasi dengan server database.');
      }
    } catch (err) {
      setError('Login Google gagal. Coba lagi.');
      console.error(err);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* background glow */}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.025) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.015) 0%, transparent 40%)',
        }}
      />

      <div className="auth-card">
        {/* brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <img src="/logo.png" alt="SakuCerdas" style={{ width: '2rem', height: '2rem', objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>SakuCerdas</span>
        </div>

        {/* Firebase not configured banner */}
        {!firebaseConfigured && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.625rem',
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: '0.625rem', padding: '0.75rem 1rem', marginBottom: '1.25rem',
            fontSize: '0.8rem', color: '#F59E0B', lineHeight: 1.5,
          }}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <span>
              <strong>Firebase belum dikonfigurasi.</strong><br />
              Salin <code>.env.example</code> ke <code>.env</code> dan isi dengan nilai dari Firebase Console.
            </span>
          </div>
        )}

        {/* header */}
        <div className="auth-header">
          <h1>Selamat datang kembali</h1>
          <p>Masukkan kredensial untuk melanjutkan.</p>
        </div>

        {/* ── Google button ── */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.625rem', padding: '0.75rem', marginBottom: '1.25rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '0.625rem', cursor: 'pointer',
            fontFamily: 'inherit', fontWeight: 600, fontSize: '0.9rem',
            color: 'var(--text)', transition: 'background 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.09)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
        >
          {googleLoading ? (
            <Loader2 size={18} className="spin-icon" />
          ) : (
            /* Google "G" coloured SVG */
            <svg width="18" height="18" viewBox="0 0 48 48" style={{ display: 'block' }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          )}
          {googleLoading ? 'Menghubungkan…' : 'Masuk dengan Google'}
        </button>

        {/* divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>atau</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        {/* email + password form */}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={16} />
              <input
                type="email" className="input-field" placeholder="nama@email.com"
                value={email} onChange={e => setEmail(e.target.value)} required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Kata Sandi</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={16} />
              <input
                type="password" className="input-field" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} required
              />
            </div>
            {error && (
              <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '0.375rem', fontWeight: 600 }}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || googleLoading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem' }}
          >
            {loading ? <><Loader2 size={16} className="spin-icon" /> Masuk…</> : 'Masuk'}
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
