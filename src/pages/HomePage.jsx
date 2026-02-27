import { useEffect, useMemo, useState } from 'react';
import { trends } from '../data/trends';
import { pathways } from '../data/pathways';
import { roles } from '../data/roles';

const quizItems = [
  { question: 'Saya rutin belajar skill baru setiap minggu.', weight: 18 },
  { question: 'Saya pernah memakai AI tools untuk kerja/belajar.', weight: 16 },
  { question: 'Saya punya portofolio project yang bisa ditunjukkan.', weight: 18 },
  { question: 'Saya paham skill yang dibutuhkan role target saya.', weight: 16 },
  { question: 'Saya punya rencana belajar 4-12 minggu yang jelas.', weight: 16 },
  { question: 'Saya aktif membangun network profesional/komunitas.', weight: 16 }
];

function scoreToPersona(score) {
  if (score >= 76) return 'Leader';
  if (score >= 51) return 'Builder';
  return 'Explorer';
}

function Counter({ value, label }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / 30);
    const id = setInterval(() => {
      start += step;
      if (start >= value) {
        setShown(value);
        clearInterval(id);
      } else {
        setShown(start);
      }
    }, 24);
    return () => clearInterval(id);
  }, [value]);

  return (
    <div className="card counter-card reveal">
      <h3>{shown}+</h3>
      <p>{label}</p>
    </div>
  );
}

export default function HomePage() {
  const [answers, setAnswers] = useState(Array(quizItems.length).fill(3));

  const score = useMemo(
    () => Math.min(100, Math.round(answers.reduce((acc, val, index) => acc + val * quizItems[index].weight / 5, 0))),
    [answers]
  );

  const persona = scoreToPersona(score);

  const recommendation = useMemo(() => {
    if (persona === 'Leader') return 'Take AI Ops + mentoring pathway, then publish portfolio case studies.';
    if (persona === 'Builder') return 'Focus on one target role and commit to a 12-week roadmap with weekly outputs.';
    return 'Start with AI Literacy 4-week sprint and build one mini project this month.';
  }, [persona]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('show');
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="container page">
      <section className="hero card reveal">
        <p className="chip">Ready for the next economy</p>
        <h1>Upgrade your work, upgrade your future.</h1>
        <p className="muted">
          Hub interaktif untuk bantu individu dan organisasi siap menghadapi AI, otomatisasi, green jobs, dan ekonomi digital.
        </p>
        <div className="cta-row">
          <a href="#/pathways" className="btn-primary">Ambil Assessment</a>
          <a href="#/opportunities" className="btn-secondary">Lihat Path</a>
          <a href="#/trends" className="btn-secondary">Unduh Report</a>
        </div>
      </section>

      <section className="grid-3 stats-section">
        <Counter value={120} label="Future-ready roles" />
        <Counter value={48} label="Skill pathways" />
        <Counter value={320} label="Community projects" />
      </section>

      <section className="card reveal">
        <h2>Future Readiness Score</h2>
        <div className="quiz-grid">
          {quizItems.map((item, index) => (
            <label key={item.question} className="quiz-item">
              <span>{item.question}</span>
              <input
                type="range"
                min="1"
                max="5"
                value={answers[index]}
                onChange={(event) => {
                  const copy = [...answers];
                  copy[index] = Number(event.target.value);
                  setAnswers(copy);
                }}
              />
            </label>
          ))}
        </div>
        <div className="score-box">
          <h3>{score}/100 · {persona}</h3>
          <p className="muted">{recommendation}</p>
        </div>
      </section>

      <section className="reveal">
        <h2>Trends Radar</h2>
        <div className="grid-3">
          {trends.map((trend) => (
            <article key={trend.id} className="card trend-card">
              <div className="trend-top">
                <p className="chip">{trend.industry}</p>
                <strong>{trend.impact}%</strong>
              </div>
              <h3>{trend.name}</h3>
              <p className="muted">{trend.why}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid-2 reveal">
        <article className="card">
          <h2>Skills Pathways</h2>
          <div className="chip-row">
            {pathways.map((pathway) => (
              <span key={pathway.id} className="chip">{pathway.name}</span>
            ))}
          </div>
        </article>
        <article className="card">
          <h2>Opportunity Map</h2>
          <p className="muted">Role → skill gap → learning steps.</p>
          <ul className="clean-list">
            {roles.slice(0, 3).map((role) => (
              <li key={role.id}>{role.title} · {role.skills[0]}, {role.skills[1]}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="card reveal">
        <h2>Success Stories</h2>
        <div className="carousel">
          <article>
            <h3>From Fresh Grad to AI Ops</h3>
            <p className="muted">Completed 12-week pathway and built 3 applied projects.</p>
          </article>
          <article>
            <h3>HR Team Shifted to Skills-Based Hiring</h3>
            <p className="muted">Reduced time-to-hire by 21% using capability mapping.</p>
          </article>
          <article>
            <h3>Career Pivot into Green Economy</h3>
            <p className="muted">Started as analyst and published first ESG portfolio in 10 weeks.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
