import { useEffect, useMemo, useState } from 'react';

export default function CommandPalette({ isOpen, items, onClose }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const filtered = useMemo(
    () => items.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  );

  if (!isOpen) return null;

  return (
    <div className="palette-backdrop" onClick={onClose}>
      <div className="palette" onClick={(event) => event.stopPropagation()}>
        <input
          autoFocus
          className="palette-input"
          placeholder="Search pages, trends, roles..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="palette-list">
          {filtered.map((item) => (
            <button key={item.id} className="palette-item" onClick={item.action}>
              {item.title}
            </button>
          ))}
          {!filtered.length && <p className="muted">No result. Try another keyword.</p>}
        </div>
      </div>
    </div>
  );
}
