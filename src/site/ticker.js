// One requestAnimationFrame loop for the whole site. Smooth scroll, the WebGL
// scene and DOM effects all subscribe here so they update in a fixed order
// inside the same frame instead of racing each other.

const subscribers = [];
let rafId = 0;
let lastTime = 0;

function scheduleFrame() {
  if (!rafId && subscribers.length && !document.hidden) rafId = requestAnimationFrame(frame);
}

function frame(time) {
  rafId = 0;
  if (document.hidden) return;
  const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 1 / 60;
  lastTime = time;
  // A subscriber can unsubscribe itself during a frame. A snapshot prevents
  // that from skipping the next effect; newly added effects start next frame.
  try {
    subscribers.slice().forEach(entry => {
      if (entry.active) entry.fn(time, delta);
    });
  } finally {
    scheduleFrame();
  }
}

function onVisibilityChange() {
  lastTime = 0;
  if (document.hidden && rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
  scheduleFrame();
}

export function addTicker(fn, priority = 0) {
  const entry = { fn, priority, active: true };
  subscribers.push(entry);
  subscribers.sort((a, b) => a.priority - b.priority);
  if (subscribers.length === 1) {
    lastTime = 0;
    document.addEventListener('visibilitychange', onVisibilityChange);
  }
  scheduleFrame();
  return () => {
    entry.active = false;
    const index = subscribers.indexOf(entry);
    if (index !== -1) subscribers.splice(index, 1);
    if (!subscribers.length) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      lastTime = 0;
      document.removeEventListener('visibilitychange', onVisibilityChange);
    }
  };
}

export function createStore(initial) {
  let state = initial;
  const listeners = new Set();
  return {
    get: () => state,
    set(next) {
      state = typeof next === 'function' ? next(state) : { ...state, ...next };
      listeners.forEach(listener => listener(state));
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

// The custom cursor reads this; the 3D scene writes to it when the pointer is
// over something interactive inside the canvas.
export const cursorStore = createStore({ label: '', active: false, color: '' });

// The preloader reads this; the home experience reports loading progress.
export const loadStore = createStore({ progress: 0, ready: false });
