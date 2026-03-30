import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Wallet } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) navigate('/dashboard');
    else setError(true);
  };

  return (
    <div className="auth-container">
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.025) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.015) 0%, transparent 40%)', pointerEvents: 'none' }} />
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
              <input type="email" className="input-field" placeholder="nama@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Kata Sandi</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={16} />
              <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginTop: '0.375rem', fontWeight: 600 }}>Email atau kata sandi salah.</p>}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem' }}>Masuk</button>
        </form>
        <div className="auth-footer">
          Belum punya akun? <button className="auth-link" onClick={() => navigate('/register')}>Daftar sekarang</button>
        </div>
      </div>
    </div>
  );
};
export default Login;
