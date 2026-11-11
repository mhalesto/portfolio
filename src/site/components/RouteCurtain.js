import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { prefersReducedMotion } from '../motion';
import { scrollToTarget } from '../scroll';
import { internalDestination, isLinkToThisPage, samePage, setLeaveHandler } from '../transition';
import Logo from './Logo';

// The cover eases both ways; the reveal sets off at once and settles slowly,
// so the dark pause between the two stays short.
const COVER_EASE = 'cubic-bezier(0.6, 0, 0.3, 1)';
const REVEAL_EASE = 'cubic-bezier(0.4, 0, 0.1, 1)';
const COVER_MS = 440;
const REVEAL_MS = 820;
// The panel has soft edges that reach past it, so it travels a little further
// than its own height to clear the screen (matches --lip in site.css).
const BELOW = 'translate3d(0, calc(100% + 18vh), 0)';
const DOWN = 'translate3d(0, 0, 0)';
const ABOVE = 'translate3d(0, calc(-100% - 18vh), 0)';

// Everything the curtain uses, or none of it: engines from a few years back
// have element.animate() but not getAnimations() or the finished promise, and
// for them (as for reduced motion) a page should simply change at once.
function canPlay(panel) {
  return (
    Boolean(panel) &&
    typeof panel.animate === 'function' &&
    typeof panel.getAnimations === 'function' &&
    typeof window.Animation === 'function' &&
    'finished' in window.Animation.prototype &&
    !prefersReducedMotion()
  );
}

const park = panel => {
  panel.style.visibility = 'hidden';
  panel.style.pointerEvents = '';
};

// One dark panel that makes moving between pages a single motion: it rises
// over the page that is leaving, the route changes underneath it, and it
// carries on up to reveal the next page. Back and forward cannot be delayed,
// so there the panel is simply already down when the new page first paints.
export default function RouteCurtain() {
  const location = useLocation();
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const markRef = useRef(null);
  // The entry the curtain last settled on. Comparing keys, rather than
  // skipping "the first run", also holds when React replays effects on mount.
  const settled = useRef({ key: location.key, path: location.pathname });
  const run = useRef({ id: 0, leaving: false, covered: false, timer: 0 });

  // Rise over the current page, then change route. Returns false when the
  // curtain cannot play, so the caller navigates straight away instead.
  const leave = useCallback(
    to => {
      const panel = panelRef.current;
      if (!canPlay(panel)) return false;
      const state = run.current;
      // A second click while the page is already leaving changes nothing.
      if (state.leaving) return true;
      const id = (state.id += 1);
      state.leaving = true;
      try {
        panel.getAnimations().forEach(animation => animation.cancel());
        panel.style.visibility = 'visible';
        panel.style.pointerEvents = 'auto';
        const rise = panel.animate([{ transform: BELOW }, { transform: DOWN }], {
          duration: COVER_MS,
          easing: COVER_EASE,
          fill: 'forwards',
        });
        if (markRef.current) {
          markRef.current.animate([{ opacity: 0 }, { opacity: 1 }], { duration: COVER_MS, easing: 'ease', fill: 'forwards' });
        }
        const go = () => {
          if (run.current.id !== id || !run.current.leaving) return;
          window.clearTimeout(run.current.timer);
          run.current.covered = true;
          navigate(to);
        };
        rise.finished.then(go, () => {});
        // A hidden tab can stall the animation; never strand the visitor.
        state.timer = window.setTimeout(go, COVER_MS + 400);
        return true;
      } catch (error) {
        // Whatever the engine objected to, the visitor still gets their page.
        state.leaving = false;
        park(panel);
        return false;
      }
    },
    [navigate],
  );

  useEffect(() => setLeaveHandler(leave), [leave]);

  // Take over ordinary clicks on links to other pages of the site. This runs
  // before React Router's own handler, which then sees the click as handled.
  useEffect(() => {
    const onClick = event => {
      const to = internalDestination(event);
      if (to) {
        if (leave(to)) event.preventDefault();
        return;
      }
      // A link to the page already open: go back to its top, and do not let
      // the router stack a duplicate history entry for it.
      if (isLinkToThisPage(event)) {
        event.preventDefault();
        scrollToTarget(0);
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [leave]);

  // The route has changed: lift away. A layout effect, so the panel is in
  // place before the new page's first paint and nothing flashes.
  useLayoutEffect(() => {
    if (settled.current.key === location.key) return undefined;
    const stayedOnPage = samePage(settled.current.path, location.pathname);
    settled.current = { key: location.key, path: location.pathname };
    const state = run.current;
    // A new entry for the same page (an in-page jump such as the skip link, a
    // changed query) is not a page change: nothing to cover or reveal.
    if (stayedOnPage && !state.leaving) return undefined;
    const arrivedCovered = state.covered;
    state.id += 1;
    state.leaving = false;
    state.covered = false;
    window.clearTimeout(state.timer);
    const panel = panelRef.current;
    if (!canPlay(panel)) {
      if (panel) park(panel);
      return undefined;
    }
    try {
      panel.getAnimations().forEach(animation => animation.cancel());
      panel.style.visibility = 'visible';
      panel.style.pointerEvents = '';
      const reveal = panel.animate([{ transform: DOWN }, { transform: ABOVE }], {
        duration: REVEAL_MS,
        // A beat for the new page to paint; longer when it arrives unannounced.
        delay: arrivedCovered ? 40 : 120,
        easing: REVEAL_EASE,
        fill: 'both',
      });
      if (markRef.current) {
        markRef.current.getAnimations().forEach(animation => animation.cancel());
        markRef.current.animate(
          arrivedCovered
            ? [{ opacity: 1 }, { opacity: 0 }]
            : [{ opacity: 0 }, { opacity: 1, offset: 0.35 }, { opacity: 0 }],
          { duration: arrivedCovered ? 420 : 700, easing: 'ease', fill: 'both' },
        );
      }
      const id = state.id;
      reveal.finished.then(
        () => {
          if (run.current.id !== id) return;
          park(panel);
          reveal.cancel();
        },
        () => {},
      );
    } catch (error) {
      // Never leave the page behind a panel the engine could not animate.
      park(panel);
    }
    return undefined;
  }, [location.key, location.pathname]);

  useEffect(
    () => () => {
      window.clearTimeout(run.current.timer);
    },
    [],
  );

  return (
    <div className="route-curtain" ref={panelRef} aria-hidden="true">
      <span className="route-curtain__mark" ref={markRef}>
        <Logo />
      </span>
    </div>
  );
}
