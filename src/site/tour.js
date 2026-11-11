import { addTicker } from './ticker';
import { scrollToTarget, setScrollPosition } from './scroll';

// The tour plays the scroll-driven journey by itself: it moves the page the
// way a visitor would, slowly through each pinned chapter and quickly between
// them, so the 3D scene, the reveals and everything else that follows the
// scroll position simply come along. Anything the visitor does takes over.
//
// A plan is a list of the page's sections in order:
//   { id, hold, reading, end }
//   hold:    seconds to spend while the section is pinned
//   reading: speed (viewport heights per second) when the section is not
//            pinned and its copy scrolls past instead
//   end:     the tour finishes this far (0 to 1) into this section's pin

export const TRAVEL = 0.5; // viewport heights per second between pinned sections
const SETTLE = 2.4; // how quickly the speed eases to a new target, per second
const BRAKE = SETTLE / 3.5; // speed allowed per pixel left before the end, per second
const MIN_SPEED = 18; // px per second: slow enough to land softly, fast enough to arrive
const TAKEOVER = 3; // px the page may differ from where the tour put it
const REMEASURE_EVERY = 45; // frames
const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar', 'Escape']);

// Reads where each section sits and how it behaves at this window size.
export function measureTour(plan) {
  const scrollY = window.scrollY;
  const viewport = window.innerHeight;
  const limit = Math.max(0, document.documentElement.scrollHeight - viewport);
  const zones = [];
  let end = null;
  plan.forEach(step => {
    const section = document.getElementById(step.id);
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (!rect.height) return;
    const top = rect.top + scrollY;
    const bottom = top + rect.height;
    // A section is pinned when its first child is sticky and shorter than it.
    const sticky = section.firstElementChild;
    const stuck = sticky && window.getComputedStyle(sticky).position === 'sticky' ? sticky.offsetHeight || viewport : 0;
    const pin = stuck && rect.height > stuck + 1 ? rect.height - stuck : 0;
    zones.push({
      id: step.id,
      top,
      bottom,
      pinEnd: top + pin,
      // px per second
      pinSpeed: pin && step.hold ? pin / step.hold : 0,
      readSpeed: (step.reading || TRAVEL) * viewport,
    });
    if (step.end !== undefined) end = top + pin * step.end;
  });
  return { zones, viewport, travel: TRAVEL * viewport, end: Math.min(end === null ? limit : end, limit) };
}

// How fast the page should be moving (px per second) when scrolled to y.
export function speedAt(tour, y) {
  const { zones, viewport, travel } = tour;
  for (let i = 0; i < zones.length; i += 1) {
    const zone = zones[i];
    if (zone.pinSpeed && y >= zone.top && y < zone.pinEnd) return zone.pinSpeed;
  }
  // Not pinned: go by whichever section is crossing the middle of the screen.
  const centre = y + viewport / 2;
  for (let i = 0; i < zones.length; i += 1) {
    const zone = zones[i];
    if (centre >= zone.top && centre < zone.bottom) return zone.pinEnd > zone.top ? travel : zone.readSpeed;
  }
  return travel;
}

// One frame of the tour. Pure, so the pacing can be tested without a browser.
export function advance(tour, state, delta) {
  // Brake early enough to glide into the last frame. The speed itself lags
  // its target (SETTLE), so the braking ramp has to be shallower than that
  // lag or the page would still be moving when it reaches the end.
  const target = Math.min(speedAt(tour, state.y), Math.max(MIN_SPEED, (tour.end - state.y) * BRAKE));
  const speed = state.speed + (target - state.speed) * (1 - Math.exp(-SETTLE * delta));
  const y = Math.min(tour.end, state.y + speed * delta);
  return { y, speed, done: y >= tour.end - 0.5 };
}

const fromControl = event =>
  Boolean(event.target && event.target.closest && event.target.closest('[data-tour-control]'));

// status: 'idle' (not touring), 'playing', or 'paused' (the visitor took
// over part-way; play() carries on from wherever they are now).
export function createTour(plan, { onStatus = () => {}, onProgress = () => {}, onEnd = () => {} } = {}) {
  let status = 'idle';
  let tour = null;
  let state = { y: 0, speed: 0 };
  let expected = 0;
  let frames = 0;
  let rewinding = false;
  let removeTicker = null;

  const setStatus = next => {
    if (next === status) return;
    status = next;
    onStatus(status);
  };

  const pause = () => {
    if (status === 'playing') halt('paused');
  };
  const onKey = event => {
    if (SCROLL_KEYS.has(event.key) && !fromControl(event)) pause();
  };
  const onPointer = event => {
    if (!fromControl(event)) pause();
  };
  const listen = on => {
    const method = on ? 'addEventListener' : 'removeEventListener';
    window[method]('wheel', pause, { passive: true });
    window[method]('touchstart', onPointer, { passive: true });
    window[method]('pointerdown', onPointer, { passive: true });
    window[method]('keydown', onKey);
  };

  function halt(next) {
    if (removeTicker) removeTicker();
    removeTicker = null;
    listen(false);
    rewinding = false;
    setStatus(next);
  }

  function frame(time, delta) {
    const actual = window.scrollY;
    // A dialog or the menu is open: wait where we are until it closes.
    if (document.documentElement.classList.contains('scroll-locked')) {
      state = { y: actual, speed: 0 };
      expected = actual;
      return;
    }
    if (rewinding) {
      if (actual > 4) return;
      rewinding = false;
      state = { y: actual, speed: 0 };
      expected = actual;
    }
    // Something other than the tour moved the page (a scrollbar drag, a jump
    // from the chapter rail): the visitor is steering now.
    if (Math.abs(actual - expected) > TAKEOVER) {
      halt('paused');
      return;
    }
    if (frames % REMEASURE_EVERY === 0) tour = measureTour(plan);
    frames += 1;
    state = advance(tour, state, delta);
    setScrollPosition(state.y);
    // The browser may round what it stores; compare against that next frame.
    expected = window.scrollY;
    onProgress(tour.end > 0 ? state.y / tour.end : 1);
    if (state.done) {
      halt('idle');
      onEnd();
    }
  }

  function play() {
    if (status === 'playing') return;
    tour = measureTour(plan);
    if (!tour.zones.length || tour.end <= 0) return;
    frames = 1;
    state = { y: window.scrollY, speed: 0 };
    expected = state.y;
    // Already at the end (or below it, by the footer): play it again from the top.
    rewinding = state.y >= tour.end - 4;
    if (rewinding) scrollToTarget(0, { duration: 1.4 });
    onProgress(rewinding ? 0 : state.y / tour.end);
    listen(true);
    // Before smooth scrolling (-10), so the page is in place for everything
    // else that reads the scroll position this frame.
    removeTicker = addTicker(frame, -11);
    setStatus('playing');
  }

  return {
    play,
    pause,
    toggle: () => (status === 'playing' ? pause() : play()),
    stop: () => {
      if (status !== 'idle') halt('idle');
    },
    getStatus: () => status,
    dispose: () => halt('idle'),
  };
}
