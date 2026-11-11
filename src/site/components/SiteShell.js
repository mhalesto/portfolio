import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Cursor from './Cursor';
import { resetScroll, setScrollPosition, startSmoothScroll, stopSmoothScroll } from '../scroll';
import { recallScroll, rememberScroll } from '../scrollMemory';

// Wraps the dark, immersive pages (home, projects, contact).
export default function SiteShell({ children, className = '' }) {
  const location = useLocation();
  const navigationType = useNavigationType();
  // The entry this page was opened for; later location changes are not ours.
  const entry = useRef({ key: location.key, back: navigationType === 'POP' });

  // A layout effect: the theme and the scroll position are settled before
  // the first paint, so a page never shows at the wrong place for a frame.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const { key, back } = entry.current;
    root.classList.add('theme-dark');

    // The browser's own restoration runs before the page exists and lands
    // somewhere arbitrary on a page this long; do it here instead.
    const history = window.history;
    const ownsRestoration = Boolean(history) && 'scrollRestoration' in history;
    if (ownsRestoration) history.scrollRestoration = 'manual';

    // Back and forward return to where the visitor was; a link starts at the top.
    const remembered = back ? recallScroll(key) : null;
    if (remembered) setScrollPosition(remembered);
    else resetScroll();
    startSmoothScroll();

    const remember = () => rememberScroll(key, window.scrollY);
    window.addEventListener('scroll', remember, { passive: true });

    return () => {
      window.removeEventListener('scroll', remember);
      // The mode belongs to whichever history entry is current when it is
      // set, and by now that is the page being opened. Product and policy
      // pages rely on the browser's own restoration, so hand it back
      // outright: "whatever it was before" could be the manual mode this
      // shell left on its own entry the last time round. If the next page is
      // one of ours, its shell takes over again straight after this.
      if (ownsRestoration) history.scrollRestoration = 'auto';
      root.classList.remove('theme-dark');
      stopSmoothScroll();
    };
  }, []);

  return (
    <div className={`site ${className}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header tone="overlay" />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      {children}
      <Footer />
    </div>
  );
}
