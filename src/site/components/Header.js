import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import LocalTime from './LocalTime';
import { apps, person } from '../data';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

// tone="overlay": transparent over the dark 3D pages until the visitor scrolls.
// tone="solid": always a dark glass bar, used above the light product pages.
export default function Header({ tone = 'solid' }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (tone !== 'overlay' || y < 320) {
        setHidden(false);
        lastY.current = y;
        return;
      }
      // Tuck the bar away while travelling down the long home journey and
      // bring it back on any deliberate scroll up. Small smooth-scroll steps
      // accumulate until they add up to a real movement.
      const delta = y - lastY.current;
      if (Math.abs(delta) < 8) return;
      setHidden(delta > 0);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [tone]);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    if (!open) return undefined;
    const onKey = event => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.classList.remove('menu-open');
    };
  }, [open]);

  const classes = [
    'site-header',
    `site-header--${tone}`,
    scrolled ? 'is-scrolled' : '',
    hidden && !open ? 'is-hidden' : '',
    open ? 'is-open' : '',
  ].join(' ');

  return (
    <>
      <header className={classes}>
        <div className="site-header__inner">
          <Link to="/" className="brand" aria-label={`${person.name}, home`}>
            <span>HG</span>
            <span className="brand__rule" aria-hidden="true" />
            <span>M</span>
          </Link>

          <nav className="site-nav" aria-label="Primary">
            {navItems.map(item => (
              <NavLink key={item.to} to={item.to} end={item.end} className="site-nav__link">
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-header__meta">
            <span className="pulse-dot" aria-hidden="true" />
            <span>{person.country}</span>
            <LocalTime />
          </div>

          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(value => !value)}
          >
            <span className="menu-toggle__label">{open ? 'Close' : 'Menu'}</span>
            <span className="menu-toggle__icon" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      <div
        id="site-menu"
        className={`site-menu${open ? ' is-open' : ''}`}
        aria-hidden={!open}
        {...(!open ? { inert: '' } : {})}
      >
        <nav className="site-menu__nav" aria-label="Menu">
          {navItems.map((item, index) => (
            <NavLink key={item.to} to={item.to} end={item.end} className="site-menu__link" style={{ '--i': index }}>
              <span className="site-menu__index">0{index + 1}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="site-menu__apps">
          <p className="eyebrow">Apps</p>
          <ul>
            {apps.map(app => (
              <li key={app.slug}>
                <Link to={app.route}>{app.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="site-menu__foot">
          <a href={`mailto:${person.email}`}>{person.email}</a>
          <a href={person.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </div>
      </div>
    </>
  );
}
