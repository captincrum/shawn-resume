import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { person } from '../data/resume';

export function Landing() {
  useEffect(() => {
    document.title = `${person.name} — Resume`;
  }, []);
  return (
    <main className="content landing">
      <div className="section__head">
        <span className="section__index">★</span>
        <h2 className="section__title">{person.name}</h2>
      </div>
      <p className="hero__summary" style={{ margin: '0 0 2rem' }}>
        My background genuinely spans both systems engineering and software development, so I built
        two focused versions instead of one that tries to cover everything. Pick whichever matches
        what you're evaluating.
      </p>
      <div className="landing__cards">
        <Link to="/ops" className="landing__card">
          <h3>Systems &amp; Infrastructure</h3>
          <p>Technical leadership, VM architecture, hardened deployments, statewide standards.</p>
        </Link>
        <Link to="/engineering" className="landing__card">
          <h3>Software Engineering</h3>
          <p>Full-stack development, automation pipelines, Python &amp; React.</p>
        </Link>
      </div>
    </main>
  );
}