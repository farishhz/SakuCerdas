import { useMemo, useState } from 'react';
import { trends } from '../data/trends';

export default function TrendsPage() {
  const [industry, setIndustry] = useState('All');
  const [region, setRegion] = useState('All');
  const [horizon, setHorizon] = useState('All');
  const [savedIds, setSavedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('saved-trends') || '[]');
    } catch {
      return [];
    }
  });

  const industries = ['All', ...new Set(trends.map((trend) => trend.industry))];
  const regions = ['All', ...new Set(trends.map((trend) => trend.region))];
  const horizons = ['All', ...new Set(trends.map((trend) => trend.horizon))];

  const filtered = useMemo(
    () => trends.filter((trend) =>
      (industry === 'All' || trend.industry === industry) &&
      (region === 'All' || trend.region === region) &&
      (horizon === 'All' || trend.horizon === horizon)
    ),
    [industry, region, horizon]
  );

  const toggleSave = (id) => {
    const next = savedIds.includes(id) ? savedIds.filter((item) => item !== id) : [...savedIds, id];
    setSavedIds(next);
    localStorage.setItem('saved-trends', JSON.stringify(next));
  };

  return (
    <div className="container page">
      <section className="card">
        <h1>Trends & Insights</h1>
        <p className="muted">Filter by industry, region, and time horizon.</p>
      </section>

      <section className="card sticky-filters">
        <div className="filters-row">
          <select value={industry} onChange={(event) => setIndustry(event.target.value)}>
            {industries.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={region} onChange={(event) => setRegion(event.target.value)}>
            {regions.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={horizon} onChange={(event) => setHorizon(event.target.value)}>
            {horizons.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </section>

      <section className="grid-2">
        {filtered.map((trend) => (
          <article key={trend.id} className="card insight-card">
            <div className="between">
              <h3>{trend.name}</h3>
              <button className="btn-ghost" onClick={() => toggleSave(trend.id)}>
                {savedIds.includes(trend.id) ? 'Saved' : 'Bookmark'}
              </button>
            </div>
            <p className="muted"><strong>Why it matters:</strong> {trend.why}</p>
            <p className="muted"><strong>What to do next:</strong> {trend.next}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
