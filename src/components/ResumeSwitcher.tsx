import { Link } from 'react-router-dom';
import type { ResumeMode } from '../data/resume';

export function ResumeSwitcher({ current }: { current: ResumeMode }) {
  return (
    <nav className="resume-switcher" aria-label="Resume focus">
      <Link
        to="/ops"
        className={'resume-switcher__pill' + (current === 'ops' ? ' active' : '')}
      >
        Systems &amp; Infrastructure
      </Link>
      <Link
        to="/engineering"
        className={'resume-switcher__pill' + (current === 'engineering' ? ' active' : '')}
      >
        Software Engineering
      </Link>
    </nav>
  );
}