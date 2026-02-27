import { useMemo, useState } from 'react';
import { pathways } from '../data/pathways';
import Toast from '../components/Toast';

const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];

export default function PathwaysPage() {
  const [goal, setGoal] = useState(pathways[0].id);
  const [duration, setDuration] = useState('4');
  const [plan, setPlan] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user-plan') || '[]');
    } catch {
      return [];
    }
  });
  const [toast, setToast] = useState('');

  const selected = useMemo(() => pathways.find((pathway) => pathway.id === goal), [goal]);
  const roadmap = duration === '4' ? selected.weeks4 : selected.weeks12;

  const addToPlan = (task) => {
    if (plan.includes(task)) return;
    const next = [...plan, task];
    setPlan(next);
    localStorage.setItem('user-plan', JSON.stringify(next));
    setToast(`Added to plan: ${task}`);
    window.setTimeout(() => setToast(''), 1800);
  };

  return (
    <div className="container page">
      <section className="card">
        <h1>Skills & Pathways</h1>
        <p className="muted">Choose your goal, map the gap, and execute your sprint plan.</p>
      </section>

      <section className="card wizard">
        <label>
          Goal
          <select value={goal} onChange={(event) => setGoal(event.target.value)}>
            {pathways.map((pathway) => <option key={pathway.id} value={pathway.id}>{pathway.name}</option>)}
          </select>
        </label>
        <label>
          Roadmap Duration
          <select value={duration} onChange={(event) => setDuration(event.target.value)}>
            <option value="4">4 Weeks</option>
            <option value="12">12 Weeks</option>
          </select>
        </label>
      </section>

      <section className="grid-2">
        <article className="card">
          <h2>Skill Gap Matrix</h2>
          <table className="matrix">
            <thead>
              <tr>
                <th>Skill Area</th>
                {skillLevels.map((lvl) => <th key={lvl}>{lvl}</th>)}
              </tr>
            </thead>
            <tbody>
              {['Core Concepts', 'Tools Usage', 'Problem Solving', 'Portfolio'].map((area, index) => (
                <tr key={area}>
                  <td>{area}</td>
                  {skillLevels.map((lvl, col) => (
                    <td key={lvl} className={col <= index % 3 ? 'filled' : ''}></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="card">
          <h2>Roadmap Timeline</h2>
          <ol className="timeline">
            {roadmap.map((task) => (
              <li key={task}>
                <span>{task}</span>
                <button className="btn-ghost" onClick={() => addToPlan(task)}>Add to plan</button>
              </li>
            ))}
          </ol>
        </article>
      </section>

      <section className="card">
        <h2>Learning Sprint Checklist</h2>
        {!plan.length ? (
          <p className="muted">Pilih roadmap item untuk mulai menyusun plan Anda.</p>
        ) : (
          <ul className="clean-list">
            {plan.map((item) => <li key={item}>✓ {item}</li>)}
          </ul>
        )}
      </section>

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}
