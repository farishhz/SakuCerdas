import { useMemo, useState } from 'react';

export default function ToolsPage() {
  const [budget, setBudget] = useState(5000000);
  const [learning, setLearning] = useState(20);
  const [deepWork, setDeepWork] = useState(10);
  const [toolChoice, setToolChoice] = useState('General AI Assistant');
  const [sensitiveData, setSensitiveData] = useState(false);

  const productivityScore = useMemo(() => Math.min(100, Math.round((learning * 2 + deepWork * 3) / 2)), [learning, deepWork]);
  const runwayMonths = useMemo(() => Math.max(1, Math.floor(budget / 1500000)), [budget]);

  return (
    <div className="container page">
      <section className="card">
        <h1>Tools Playground</h1>
        <p className="muted">AI Literacy simulation + mini calculators for budget and productivity.</p>
      </section>

      <section className="grid-2">
        <article className="card">
          <h2>AI Literacy Playground</h2>
          <label>
            Use case tool
            <select value={toolChoice} onChange={(event) => setToolChoice(event.target.value)}>
              <option>General AI Assistant</option>
              <option>Code Assistant</option>
              <option>Design Assistant</option>
              <option>Research Assistant</option>
            </select>
          </label>
          <label className="switch-row">
            <input
              type="checkbox"
              checked={sensitiveData}
              onChange={(event) => setSensitiveData(event.target.checked)}
            />
            Will this task include sensitive data?
          </label>
          <p className="muted">
            Recommendation: {sensitiveData
              ? 'Gunakan data minimization, anonymization, dan cek policy internal sebelum upload.'
              : `Tool ${toolChoice} cocok untuk workflow awal dengan review manual output.`}
          </p>
        </article>

        <article className="card">
          <h2>Budget Calculator</h2>
          <label>
            Monthly learning budget (IDR)
            <input
              type="range"
              min="500000"
              max="15000000"
              step="500000"
              value={budget}
              onChange={(event) => setBudget(Number(event.target.value))}
            />
          </label>
          <h3>Runway: {runwayMonths} bulan</h3>
          <p className="muted">Simulasi sederhana untuk menjaga konsistensi investasi upskill.</p>
        </article>
      </section>

      <section className="card">
        <h2>Productivity Calculator</h2>
        <div className="grid-2">
          <label>
            Learning hours / week
            <input type="number" value={learning} onChange={(event) => setLearning(Number(event.target.value) || 0)} />
          </label>
          <label>
            Deep work hours / week
            <input type="number" value={deepWork} onChange={(event) => setDeepWork(Number(event.target.value) || 0)} />
          </label>
        </div>
        <h3>Focus Score: {productivityScore}/100</h3>
      </section>
    </div>
  );
}
