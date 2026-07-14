import { person, contacts } from '../data/resume';
import type { ResumeProfile } from '../data/resume';

export function Hero({ profile }: { profile: ResumeProfile }) {
  return (
    <header className="hero">
      <div className="hero__topbar">
        <span className="hero__location">{person.location}</span>
      </div>

      <div className="hero__main">
        <p className="hero__eyebrow">Building systems that work at scale</p>
        <h1 className="hero__name">{person.name}</h1>
        <p className="hero__title">{profile.title}</p>
        <p className="hero__summary">{profile.summary}</p>

        <nav className="hero__contacts" aria-label="Contact">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="contact-link"
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
            >
              <span className="contact-link__label">{c.label}</span>
              <span className="contact-link__value">{c.value}</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
