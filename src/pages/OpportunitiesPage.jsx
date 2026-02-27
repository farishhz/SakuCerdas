import { useMemo, useState } from 'react';
import { roles } from '../data/roles';

export default function OpportunitiesPage() {
  const [skillQuery, setSkillQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState(roles[0]);

  const matched = useMemo(() => {
    const query = skillQuery.trim().toLowerCase();
    if (!query) return roles;
    return roles.filter((role) => role.skills.some((skill) => skill.toLowerCase().includes(query)));
  }, [skillQuery]);

  return (
    <div className="container page">
      <section className="card">
        <h1>Jobs & Economy Opportunity</h1>
        <p className="muted">Explore future-ready roles and map your skills to opportunities.</p>
      </section>

      <section className="card">
        <h2>Skill to Role</h2>
        <input
          className="text-input"
          placeholder="Type a skill (e.g. Analytics, Prompt, Reporting)"
          value={skillQuery}
          onChange={(event) => setSkillQuery(event.target.value)}
        />
      </section>

      <section className="grid-2">
        <article className="card">
          <h2>Role Explorer</h2>
          <div className="role-list">
            {matched.map((role) => (
              <button
                key={role.id}
                className={`role-item ${selectedRole.id === role.id ? 'active' : ''}`}
                onClick={() => setSelectedRole(role)}
              >
                <strong>{role.title}</strong>
                <span>{role.domain} · {role.level}</span>
              </button>
            ))}
          </div>
        </article>

        <article className="card">
          <h2>Role Detail</h2>
          <h3>{selectedRole.title}</h3>
          <p className="muted">{selectedRole.description}</p>
          <div className="chip-row">
            {selectedRole.skills.map((skill) => <span key={skill} className="chip">{skill}</span>)}
          </div>
          <h3>Portfolio Builder</h3>
          <ul className="clean-list">
            {selectedRole.projects.map((project) => <li key={project}>□ {project}</li>)}
          </ul>
        </article>
      </section>
    </div>
  );
}
