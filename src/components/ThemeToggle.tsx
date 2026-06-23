import type { Theme } from '../hooks/useTheme';

interface Props {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: Props) {
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      className="theme-switch"
      role="switch"
      aria-checked={isDark}
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <span className="theme-switch__track">
        <span className="theme-switch__thumb">
          {isDark ? (
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="2" x2="12" y2="4.5" />
                <line x1="12" y1="19.5" x2="12" y2="22" />
                <line x1="2" y1="12" x2="4.5" y2="12" />
                <line x1="19.5" y1="12" x2="22" y2="12" />
                <line x1="4.8" y1="4.8" x2="6.6" y2="6.6" />
                <line x1="17.4" y1="17.4" x2="19.2" y2="19.2" />
                <line x1="4.8" y1="19.2" x2="6.6" y2="17.4" />
                <line x1="17.4" y1="6.6" x2="19.2" y2="4.8" />
              </g>
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}