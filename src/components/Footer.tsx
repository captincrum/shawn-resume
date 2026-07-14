import { person, contacts } from '../data/resume';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <p className="footer__name">{person.name}</p>
      <nav className="footer__links" aria-label="Footer">
        {contacts.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith('http') ? '_blank' : undefined}
            rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
          >
            {c.label}
          </a>
        ))}
      </nav>
      <p className="footer__note">© {year} · Built with React &amp; TypeScript</p>
    </footer>
  );
}
