import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import LocalTime from './LocalTime';
import { portfolioApps as apps, person } from '../data';
import { setScrollLocked } from '../scroll';
import './header.css';

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
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

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
    const menu = menuRef.current;
    const toggle = toggleRef.current;
    const background = Array.from(headerRef.current.parentElement.children)
      .filter(element => element !== headerRef.current && element !== menu)
      .map(element => ({ element, inert: element.getAttribute('inert') }));
    background.forEach(({ element }) => element.setAttribute('inert', ''));
    setScrollLocked(true, 'mobile-menu');
    const links = () => Array.from(menu.querySelectorAll('a[href], button:not([disabled])'));
    const firstLink = links()[0];
    if (firstLink) firstLink.focus({ preventScroll: true });
    const onKey = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
      if (event.key !== 'Tab') return;
      const focusable = [toggle, ...links()];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const onFocus = event => {
      if (event.target !== toggle && !menu.contains(event.target)) firstLink?.focus({ preventScroll: true });
    };
    const desktop = window.matchMedia?.('(min-width: 821px)');
    const onResize = event => {
      if (event.matches) setOpen(false);
    };
    desktop?.addEventListener?.('change', onResize);
    window.addEventListener('keydown', onKey);
    document.addEventListener('focusin', onFocus);
    return () => {
      desktop?.removeEventListener?.('change', onResize);
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('focusin', onFocus);
      document.documentElement.classList.remove('menu-open');
      background.forEach(({ element, inert }) => {
        if (inert === null) element.removeAttribute('inert');
        else element.setAttribute('inert', inert);
      });
      setScrollLocked(false, 'mobile-menu');
      // A route change may remove this header. In that case the new page
      // owns focus; do not send it back to a detached menu control.
      if (toggle?.isConnected) toggle.focus({ preventScroll: true });
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
      <header className={classes} ref={headerRef}>
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
            ref={toggleRef}
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
        ref={menuRef}
        className={`site-menu${open ? ' is-open' : ''}`}
        aria-hidden={!open}
        data-lenis-prevent
        onClick={event => {
          if (event.target.closest('a')) setOpen(false);
        }}
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
