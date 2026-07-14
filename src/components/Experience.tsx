import type { Role } from '../data/resume';

export function Experience({ roles }: { roles: Role[] }) {
  return (
    <section className="section" id="experience">
      <div className="section__head">
        <span className="section__index">01</span>
        <h2 className="section__title">Experience</h2>
      </div>

      <div className="roles">
        {roles.map((role) => (
          <article className="role" key={role.title + role.period}>
            <div className="role__meta">
              <h3 className="role__title">
                {role.title}
                {role.current && <span className="role__badge">Current</span>}
              </h3>
              <p className="role__company">{role.company}</p>
              <p className="role__sub">
                {role.location} · {role.period}
              </p>
            </div>
            <ul className="role__bullets">
              {role.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
