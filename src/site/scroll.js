import { addTicker } from './ticker';
import { prefersReducedMotion } from './motion';

// Lenis gives the long 3D journey its weight. It is loaded on demand so the
// legacy product pages never pay for it, and it is skipped entirely when the
// visitor prefers reduced motion (native scrolling is used instead).

export const scrollState = { y: 0, velocity: 0, direction: 1 };

let lenis = null;
let removeTicker = null;
let removeNative = null;
let users = 0;
let generation = 0;

function trackNative() {
  let last = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    scrollState.velocity = y - last;
    scrollState.direction = y >= last ? 1 : -1;
    scrollState.y = y;
    last = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  const decay = addTicker(() => {
    scrollState.velocity *= 0.85;
  }, -9);
  onScroll();
  return () => {
    window.removeEventListener('scroll', onScroll);
    decay();
  };
}

export async function startSmoothScroll() {
  users += 1;
  if (users > 1) return;
  generation += 1;
  const current = generation;
  scrollState.y = window.scrollY;

  if (prefersReducedMotion()) {
    removeNative = trackNative();
    return;
  }

  try {
    const { default: Lenis } = await import('lenis');
    // The shell may have unmounted (or remounted) while Lenis was loading.
    if (current !== generation || users === 0) return;
    lenis = new Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      autoRaf: false,
    });
    lenis.on('scroll', instance => {
      scrollState.y = instance.scroll;
      scrollState.velocity = instance.velocity;
      scrollState.direction = instance.direction || scrollState.direction;
    });
    if (scrollLocks.size) lenis.stop();
    removeTicker = addTicker(time => lenis && lenis.raf(time), -10);
  } catch (error) {
    if (current === generation && users > 0) removeNative = trackNative();
  }
}

export function stopSmoothScroll() {
  users = Math.max(0, users - 1);
  if (users > 0) return;
  generation += 1;
  if (removeTicker) removeTicker();
  if (removeNative) removeNative();
  if (lenis) lenis.destroy();
  lenis = null;
  removeTicker = null;
  removeNative = null;
}

export function scrollToTarget(target, options = {}) {
  let element = target;
  if (typeof target === 'string') {
    try {
      element = document.querySelector(target);
    } catch (error) {
      return;
    }
    if (!element) return;
  }
  if (lenis) {
    lenis.scrollTo(element ?? target, { duration: 1.6, ...options });
    return;
  }
  const top = typeof target === 'number'
    ? target
    : element && element.getBoundingClientRect
      ? element.getBoundingClientRect().top + window.scrollY
      : null;
  if (top === null || !Number.isFinite(top)) return;
  window.scrollTo({
    top: Math.max(0, top + (Number(options.offset) || 0)),
    behavior: options.immediate || options.duration === 0 || prefersReducedMotion() ? 'instant' : 'smooth',
  });
}

// Each overlay owns its lock, so closing a menu cannot unlock an open dialog.
const scrollLocks = new Set();

export function setScrollLocked(value, owner = 'default') {
  if (value) scrollLocks.add(owner);
  else scrollLocks.delete(owner);
  const locked = scrollLocks.size > 0;
  document.documentElement.classList.toggle('scroll-locked', locked);
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}

export function resetScroll() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
  scrollState.y = 0;
  scrollState.velocity = 0;
}
