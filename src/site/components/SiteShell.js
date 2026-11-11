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
  // The router's key alone does not identify a history entry: every entry it
  // did not create itself (the first page of a visit, the one the browser
  // adds for an in-page jump such as the skip link) is keyed "default". The
  // address tells those apart.
  const memoryKey = `${location.pathname.replace(/\/+$/, '')}${location.search}${location.hash}|${location.key}`;
  // How this page was opened decides where it starts.
  const entry = useRef({ key: memoryKey, back: navigationType === 'POP' });
  // The entry can change while this page stays mounted (a link to the same
  // route with a different query, say). Positions belong to the current one.
  const currentKey = useRef(memoryKey);
  currentKey.current = memoryKey;

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

    const remember = () => rememberScroll(currentKey.current, window.scrollY);
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

  // The entry changed under a page that stays mounted: an in-page jump, a
  // changed query, or Back and Forward between two such entries. Returning to
  // an entry goes back to where it was left, as the browser would do for
  // itself; a new one starts out wherever the page is now.
  const shownKey = useRef(memoryKey);
  useLayoutEffect(() => {
    if (shownKey.current === memoryKey) return;
    shownKey.current = memoryKey;
    const remembered = navigationType === 'POP' ? recallScroll(memoryKey) : null;
    if (remembered === null) rememberScroll(memoryKey, window.scrollY);
    else setScrollPosition(remembered);
  }, [memoryKey, navigationType]);

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
