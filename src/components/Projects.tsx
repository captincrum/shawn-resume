import { projects } from '../data/resume';

export function Projects() {
  return (
    <section className="section" id="projects">
      <div className="section__head">
        <span className="section__index">03</span>
        <h2 className="section__title">Projects</h2>
      </div>

      <div className="projects">
        {projects.map((p) => (
          <article className="project" key={p.name}>
            <header className="project__head">
              <h3 className="project__name">{p.name}</h3>
              <p className="project__tagline">{p.tagline}</p>
            </header>
            <ul className="project__bullets">
              {p.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
