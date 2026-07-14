import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import type { Theme } from '../hooks/useTheme';
import { person } from '../data/resume';

interface Props {
  theme: Theme;
  onToggle: () => void;
}

const games = [
  { to: '/games/find-the-cat', label: 'Find the Cat' },
  { to: '/games/snake', label: 'Snake' },
  { to: '/games/minesweeper', label: 'Minesweeper' },
  { to: '/games/connect4', label: 'Connect 4' },
];

export function Nav({ theme, onToggle }: Props) {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const onGames = loc.pathname.startsWith('/games');

  return (
    <nav className="nav" aria-label="Primary">
      <div className="nav__inner">
        <NavLink to="/" className="nav__brand">
          {person.name}
        </NavLink>

        <div className="nav__right">
          <NavLink
            to="/"
            end
            className={({ isActive }) => 'nav__link' + (isActive ? ' active' : '')}
          >
            Resume
          </NavLink>

          <div className="nav__dropdown" onMouseLeave={() => setOpen(false)}>
            <button
              type="button"
              className={`nav__link nav__dropdown-toggle${onGames ? ' active' : ''}`}
              aria-haspopup="true"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              Games
              <svg className="nav__caret" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
                <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {open && (
              <ul className="nav__menu">
                {games.map((g) => (
                  <li key={g.to}>
                    <NavLink
                      to={g.to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        'nav__menu-item' + (isActive ? ' active' : '')
                      }
                    >
                      {g.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <ThemeToggle theme={theme} onToggle={onToggle} />
        </div>
      </div>
    </nav>
  );
}