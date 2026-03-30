import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Wallet } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const handleRegister = (e: React.FormEvent) => { e.preventDefault(); navigate('/login'); };

  return (
    <div className="auth-container">
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.025) 0%, transparent 50%)', pointerEvents: 'none' }} />
      <div className="auth-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={14} color="#080808" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>SakuCerdas</span>
        </div>
        <div className="auth-header">
          <h1>Buat akun baru</h1>
          <p>Gratis selamanya. Tidak perlu kartu kredit.</p>
        </div>
        <form onSubmit={handleRegister}>
          {[
            { label: 'Nama Lengkap', type: 'text', placeholder: 'John Doe', icon: User },
            { label: 'Email', type: 'email', placeholder: 'john@example.com', icon: Mail },
            { label: 'Nomor WhatsApp', type: 'tel', placeholder: '08123456789', icon: Phone },
            { label: 'Kata Sandi', type: 'password', placeholder: 'Min. 8 karakter', icon: Lock },
          ].map(({ label, type, placeholder, icon: Icon }) => (
            <div className="input-group" key={label}>
              <label className="input-label">{label}</label>
              <div className="input-wrapper">
                <Icon className="input-icon" size={16} />
                <input required type={type} className="input-field" placeholder={placeholder} />
              </div>
            </div>
          ))}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem' }}>Buat Akun</button>
        </form>
        <div className="auth-footer">
          Sudah punya akun? <button className="auth-link" onClick={() => navigate('/login')}>Masuk di sini</button>
        </div>
      </div>
    </div>
  );
};
export default Register;
