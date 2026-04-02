import { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';

export type Theme = 'sakucerdas' | 'dark' | 'light' | 'system';

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'sakucerdas';
  });

  useEffect(() => {
    const applyTheme = (t: Theme) => {
      let activeTheme = t;
      if (t === 'system') {
        activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', activeTheme);
    };

    applyTheme(theme);
    localStorage.setItem('theme', theme);

    // Listen for system changes if mode is system
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  return { theme, setTheme };
};

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem 0.875rem' }}>
      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', fontWeight: 600 }}>
        Tema Tampilan
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'sakucerdas', label: 'Bawaan' },
          { id: 'dark', label: 'Dark' },
          { id: 'light', label: 'Light' },
          { id: 'system', label: 'Auto' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id as Theme)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
              padding: '0.4rem 0.5rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: theme === t.id ? 700 : 500,
              background: theme === t.id ? 'var(--accent-grad)' : 'rgba(139,92,246,0.08)',
              color: theme === t.id ? 'white' : 'var(--text-dim)',
              border: `1px solid ${theme === t.id ? 'transparent' : 'rgba(139,92,246,0.15)'}`,
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
          >
            <Palette size={12} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
export default ThemeToggle;
