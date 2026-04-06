import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Wallet, AlertCircle } from 'lucide-react';
import { authService } from '../lib/services';

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    authService.getCurrentUser().then(user => {
      if (user) navigate('/dashboard', { replace: true });
    });
  }, [navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Kata sandi minimal 8 karakter.');
      return;
    }

    setLoading(true);
    try {
      await authService.register(email, password, fullName, phone);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Pendaftaran gagal.';
      if (msg.includes('already registered') || msg.includes('User already registered')) {
        setError('Email ini sudah terdaftar. Silakan masuk.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.015) 0%, transparent 50%)', pointerEvents: 'none' }} />
      <div className="auth-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={14} style={{ color: 'var(--text)' }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>SakuCerdas</span>
        </div>

        <div className="auth-header">
          <h1>Buat akun baru</h1>
          <p>Gratis selamanya. Tidak perlu kartu kredit.</p>
        </div>

        <form onSubmit={handleRegister}>
          {[
            { label: 'Nama Lengkap', type: 'text',     placeholder: 'John Doe',           icon: User,  val: fullName, set: setFullName },
            { label: 'Email',        type: 'email',    placeholder: 'john@example.com',   icon: Mail,  val: email,    set: setEmail    },
            { label: 'No. WhatsApp', type: 'tel',      placeholder: '08123456789',        icon: Phone, val: phone,    set: setPhone    },
            { label: 'Kata Sandi',   type: 'password', placeholder: 'Min. 8 karakter',    icon: Lock,  val: password, set: setPassword },
          ].map(({ label, type, placeholder, icon: Icon, val, set }) => (
            <div className="input-group" key={label}>
              <label className="input-label">{label}</label>
              <div className="input-wrapper">
                <Icon className="input-icon" size={16} />
                <input
                  required type={type} className="input-field"
                  placeholder={placeholder}
                  value={val} onChange={e => set(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          ))}

          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.625rem', padding: '0.75rem', marginBottom: '1rem' }}>
              <AlertCircle size={15} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '1px' }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--danger)', fontWeight: 500 }}>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Membuat akun...' : 'Buat Akun'}
          </button>
        </form>

        <div className="auth-footer">
          Sudah punya akun?{' '}
          <button className="auth-link" onClick={() => navigate('/login')}>
            Masuk di sini
          </button>
        </div>
      </div>
    </div>
  );
};
export default Register;
