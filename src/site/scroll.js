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
    if (locked) lenis.stop();
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
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (lenis) {
    lenis.scrollTo(element ?? target, { duration: 1.6, ...options });
    return;
  }
  if (element && element.scrollIntoView) {
    element.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  } else if (typeof target === 'number') {
    window.scrollTo(0, target);
  }
}

let locked = false;

export function setScrollLocked(value) {
  locked = value;
  document.documentElement.classList.toggle('scroll-locked', value);
  if (!lenis) return;
  if (value) lenis.stop();
  else lenis.start();
}

export function resetScroll() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
  scrollState.y = 0;
  scrollState.velocity = 0;
}
