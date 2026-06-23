import { skills, certifications } from '../data/resume';

export function Skills() {
  return (
    <section className="section" id="skills">
      <div className="section__head">
        <span className="section__index">04</span>
        <h2 className="section__title">Skills &amp; Certifications</h2>
      </div>

      <div className="skills">
        {skills.map((group) => (
          <div className="skill-group" key={group.category}>
            <h3 className="skill-group__title">{group.category}</h3>
            <ul className="skill-group__tags">
              {group.skills.map((s) => (
                <li className="tag" key={s}>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="certs">
        {certifications.map((c) => (
          <div className="cert" key={c.name}>
            <span className="cert__name">{c.name}</span>
            <span className="cert__issuer">{c.issuer}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
