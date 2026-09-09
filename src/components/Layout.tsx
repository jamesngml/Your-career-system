import { NavLink, Link, useLocation } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { InstallPrompt } from './InstallPrompt';
import { UpdateToast } from './UpdateToast';

const NAV = [
  { to: '/', label: 'Situations', end: true, icon: SituationsIcon },
  { to: '/tools', label: 'Tools', end: false, icon: ToolsIcon },
  { to: '/about', label: 'About', end: false, icon: AboutIcon },
];

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  // Scroll to top on route change (deep links should land at the top).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header className="appbar">
        <div className="appbar__inner">
          <Link to="/" className="appbar__brand">
            <span className="appbar__brand-mark" aria-hidden="true" />
            <span className="appbar__brand-text">
              <span className="appbar__brand-tag">HPB · High Performer Blueprint</span>
              <span className="appbar__brand-name">Your Career System</span>
            </span>
          </Link>
          <nav className="appbar__nav" aria-label="Primary">
            {NAV.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `appbar__link${isActive ? ' appbar__link--active' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main id="main" className="main" tabIndex={-1}>
        <div className="main__inner">
          <InstallPrompt />
          {children}
        </div>
      </main>

      <footer className="foot">
        <div className="foot__inner">
          Insights Associates Pte Ltd &nbsp;|&nbsp; Copyright 2026 &nbsp;|&nbsp; HPB Module 6
          reference
        </div>
      </footer>

      <nav className="bottomnav" aria-label="Primary">
        {NAV.map(({ to, label, end, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `bottomnav__link${isActive ? ' bottomnav__link--active' : ''}`
            }
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <UpdateToast />
    </div>
  );
}

function SituationsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function ToolsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2z" />
    </svg>
  );
}
function AboutIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <line x1="12" y1="8" x2="12" y2="8" />
    </svg>
  );
}
