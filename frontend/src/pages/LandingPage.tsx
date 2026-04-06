import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../lib/services';
import { ArrowRight, Target, TrendingUp, ShieldCheck, PiggyBank } from 'lucide-react';

const features = [
  { icon: Target,     label: 'Target Impian',      desc: 'Atur target finansial dan pantau progresnya sampai tercapai.' },
  { icon: TrendingUp, label: 'Simulasi Investasi',  desc: 'Hitung real return dari compound interest selama puluhan tahun.' },
  { icon: PiggyBank,  label: 'Budget Kategori',     desc: 'Set batas pengeluaran per kategori, dapat peringatan realtime.' },
  { icon: ShieldCheck,label: 'Dana Darurat',        desc: 'Kalkulator kebutuhan dana darurat berdasarkan kondisi kamu.' },
];

/* Brand colours from SakuCerdas logo */
const grad = 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 50%, #22C55E 100%)';
const gradText: React.CSSProperties = {
  background: grad,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    authService.getCurrentUser().then(user => {
      if (user) navigate('/dashboard', { replace: true });
    });
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', background: '#07040F', color: '#F0EDFF', fontFamily: 'Inter, sans-serif', position: 'relative', overflow: 'hidden' }}>
      {/* ambient glows */}
      <div style={{ position: 'fixed', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 70%)', top: '-200px', left: '-200px', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.10) 0%, transparent 70%)', bottom: '-150px', right: '-150px', pointerEvents: 'none' }} />

      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.25rem 2.5rem',
        borderBottom: '1px solid rgba(139,92,246,0.15)',
        backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(7,4,15,0.85)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <img src="/logo.png" alt="SakuCerdas" style={{ width: '2.25rem', height: '2.25rem', objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em', ...gradText }}>SakuCerdas</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => navigate('/login')}  className="btn btn-ghost" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>Masuk</button>
          <button onClick={() => navigate('/register')} className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>Daftar Gratis</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center', padding: '8rem 2rem 5rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
          background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)',
          borderRadius: '2rem', padding: '0.35rem 0.875rem', marginBottom: '2rem',
          fontSize: '0.78rem', fontWeight: 600, color: '#A78BFA', letterSpacing: '0.05em',
        }}>
          MANAJEMEN KEUANGAN PRIBADI
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1.05, marginBottom: '1.5rem' }}>
          Kelola uangmu<br />
          <span style={gradText}>lebih cerdas.</span>
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#5A4F72', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '520px', margin: '0 auto 2.5rem' }}>
          Target tabungan, simulasi investasi, budget kategori, kalkulator dana darurat — semuanya dalam satu aplikasi yang bersih dan mudah digunakan.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/register')} className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
            Mulai Gratis <ArrowRight size={18} />
          </button>
          <button onClick={() => navigate('/login')} className="btn btn-ghost" style={{ padding: '0.875rem 2rem', fontSize: '1rem' }}>
            Sudah punya akun
          </button>
        </div>
        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
          {['Gratis Selamanya', '4 Fitur Utama', 'Data Privat & Aman'].map(t => (
            <div key={t} style={{ fontSize: '0.8rem', color: '#5A4F72', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: grad }} />{t}
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 2rem 5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {features.map(({ icon: Icon, label, desc }, i) => (
          <div key={label}
            style={{
              background: 'rgba(139,92,246,0.05)',
              border: '1px solid rgba(139,92,246,0.15)',
              borderRadius: '1rem', padding: '1.5rem',
              transition: 'border-color 0.2s, background 0.2s, transform 0.25s',
              animationDelay: `${i * 80}ms`,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(139,92,246,0.4)';
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(139,92,246,0.09)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(139,92,246,0.15)';
              (e.currentTarget as HTMLDivElement).style.background = 'rgba(139,92,246,0.05)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem',
              background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1.25rem', boxShadow: '0 4px 16px rgba(139,92,246,0.35)',
            }}>
              <Icon size={18} color="white" />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem', ...gradText }}>{label}</div>
            <div style={{ fontSize: '0.82rem', color: '#5A4F72', lineHeight: 1.65 }}>{desc}</div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem 2rem 6rem', textAlign: 'center' }}>
        <div style={{
          background: 'rgba(139,92,246,0.06)',
          border: '1px solid rgba(139,92,246,0.2)',
          borderRadius: '1.25rem', padding: '3rem 2rem',
          boxShadow: '0 16px 48px rgba(109,40,217,0.15)',
        }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.75rem', ...gradText }}>
            Siap memulai?
          </h2>
          <p style={{ color: '#5A4F72', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Buat akun gratis dan mulai kelola keuanganmu hari ini.
          </p>
          <button onClick={() => navigate('/register')} className="btn btn-primary" style={{ padding: '0.875rem 2.5rem', fontSize: '0.95rem' }}>
            Buat Akun Sekarang <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};
export default LandingPage;
