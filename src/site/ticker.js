// One requestAnimationFrame loop for the whole site. Smooth scroll, the WebGL
// scene and DOM effects all subscribe here so they update in a fixed order
// inside the same frame instead of racing each other.

const subscribers = [];
let rafId = 0;
let lastTime = 0;

function frame(time) {
  rafId = requestAnimationFrame(frame);
  const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 1 / 60;
  lastTime = time;
  for (let i = 0; i < subscribers.length; i += 1) {
    subscribers[i].fn(time, delta);
  }
}

export function addTicker(fn, priority = 0) {
  const entry = { fn, priority };
  subscribers.push(entry);
  subscribers.sort((a, b) => a.priority - b.priority);
  if (!rafId) {
    lastTime = 0;
    rafId = requestAnimationFrame(frame);
  }
  return () => {
    const index = subscribers.indexOf(entry);
    if (index !== -1) subscribers.splice(index, 1);
    if (!subscribers.length && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
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
