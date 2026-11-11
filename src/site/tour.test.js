import { TRAVEL, advance, createTour, measureTour, speedAt } from './tour';
import { addTicker } from './ticker';
import { scrollToTarget, setScrollPosition } from './scroll';

jest.mock('./ticker', () => ({ addTicker: jest.fn() }));
jest.mock('./scroll', () => ({ scrollToTarget: jest.fn(), setScrollPosition: jest.fn() }));

const VIEWPORT = 800;

// jsdom has no layout, so each section reports the box the test gives it.
// A pinned section is one whose first child is sticky and one viewport tall.
function section(id, top, height, pinned) {
  const element = document.createElement('section');
  element.id = id;
  element.getBoundingClientRect = () => ({ top: top - window.scrollY, height });
  const child = document.createElement('div');
  if (pinned) {
    child.style.position = 'sticky';
    Object.defineProperty(child, 'offsetHeight', { value: VIEWPORT });
  }
  element.appendChild(child);
  document.body.appendChild(element);
  return element;
}

const setScroll = y => Object.defineProperty(window, 'scrollY', { value: y, configurable: true });

// hero pinned for one viewport, a chapter pinned for one viewport, an About
// section that scrolls, and a finale pinned for one viewport.
const plan = [
  { id: 'top', hold: 5 },
  { id: 'chapter', hold: 4, reading: 0.25 },
  { id: 'about', reading: 0.25 },
  { id: 'finale', hold: 4, end: 0.5 },
];

function desktopPage() {
  section('top', 0, 1600, true);
  section('chapter', 1600, 1600, true);
  section('about', 3200, 1600, false);
  section('finale', 4800, 1600, true);
  Object.defineProperty(document.documentElement, 'scrollHeight', { value: 7200, configurable: true });
}

let innerHeight;
let frame;
beforeEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
  document.documentElement.className = '';
  innerHeight = window.innerHeight;
  window.innerHeight = VIEWPORT;
  setScroll(0);
  // The page follows wherever the tour puts it, as a browser would.
  setScrollPosition.mockImplementation(y => setScroll(y));
  frame = null;
  addTicker.mockImplementation(fn => {
    frame = fn;
    return jest.fn(() => {
      frame = null;
    });
  });
});
afterEach(() => {
  window.innerHeight = innerHeight;
});

// Runs frames at 60 per second until the tour stops or the time is up.
function run(seconds, onFrame = () => {}) {
  let elapsed = 0;
  while (frame && elapsed < seconds) {
    frame(elapsed * 1000, 1 / 60);
    elapsed += 1 / 60;
    onFrame(elapsed);
  }
  return elapsed;
}

test('measures each section, how long it is pinned and where the tour ends', () => {
  desktopPage();
  const tour = measureTour(plan);
  expect(tour.zones.map(zone => [zone.id, zone.top, zone.pinEnd])).toEqual([
    ['top', 0, 800],
    ['chapter', 1600, 2400],
    ['about', 3200, 3200],
    ['finale', 4800, 5600],
  ]);
  // Half-way into the finale's pin.
  expect(tour.end).toBe(5200);
  // 800px of pin held for 5 seconds.
  expect(tour.zones[0].pinSpeed).toBe(160);
});

test('moves slowly through pinned sections and quickly between them', () => {
  desktopPage();
  const tour = measureTour(plan);
  expect(speedAt(tour, 400)).toBe(160); // hero pinned: 800px in 5s
  expect(speedAt(tour, 1000)).toBe(TRAVEL * VIEWPORT); // hero leaving
  expect(speedAt(tour, 1400)).toBe(TRAVEL * VIEWPORT); // chapter arriving
  expect(speedAt(tour, 2000)).toBe(200); // chapter pinned: 800px in 4s
  expect(speedAt(tour, 3300)).toBe(0.25 * VIEWPORT); // About scrolls at a reading pace
});

test('a section that is not pinned at this size is read, not held', () => {
  // The phone layout: the same chapter, but its copy scrolls under the world.
  section('top', 0, 1600, true);
  section('chapter', 1600, 1300, false);
  Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2900, configurable: true });
  const tour = measureTour(plan);
  expect(tour.zones[1].pinEnd).toBe(1600);
  expect(speedAt(tour, 1800)).toBe(0.25 * VIEWPORT);
});

test('speed eases towards its target and the tour glides to a stop at the end', () => {
  desktopPage();
  const tour = measureTour(plan);
  let state = { y: 0, speed: 0 };
  state = advance(tour, state, 1 / 60);
  // Sets off gently instead of jumping to full speed.
  expect(state.speed).toBeGreaterThan(0);
  expect(state.speed).toBeLessThan(160 * 0.1);
  for (let i = 0; i < 120; i += 1) state = advance(tour, state, 1 / 60);
  // Two seconds on it has all but settled on the pinned pace.
  expect(state.speed).toBeGreaterThan(155);
  expect(state.speed).toBeLessThanOrEqual(160);

  // Coming up to the end at the finale's pace, it brakes, never passes the
  // end and is barely moving when it gets there.
  state = { y: tour.end - 400, speed: 200 };
  let last = state.y;
  let frames = 0;
  while (!state.done && frames < 3000) {
    state = advance(tour, state, 1 / 60);
    expect(state.y).toBeGreaterThanOrEqual(last);
    expect(state.y).toBeLessThanOrEqual(tour.end);
    last = state.y;
    frames += 1;
  }
  expect(state.done).toBe(true);
  expect(state.speed).toBeLessThan(30);
  // A glide, not a crawl: a few seconds from 400px out.
  expect(frames / 60).toBeLessThan(9);
});

test('playing moves the page through the journey and finishes at the end', () => {
  desktopPage();
  const onStatus = jest.fn();
  const onEnd = jest.fn();
  const progress = [];
  const tour = createTour(plan, { onStatus, onEnd, onProgress: value => progress.push(value) });
  tour.play();
  expect(onStatus).toHaveBeenLastCalledWith('playing');
  expect(addTicker).toHaveBeenCalledWith(expect.any(Function), -11);

  const elapsed = run(120);
  expect(window.scrollY).toBeCloseTo(5200, 0);
  expect(onEnd).toHaveBeenCalledTimes(1);
  expect(onStatus).toHaveBeenLastCalledWith('idle');
  expect(tour.getStatus()).toBe('idle');
  // 5s + 4s of holds, a reading stretch and the travel between: well under a minute here.
  expect(elapsed).toBeGreaterThan(15);
  expect(elapsed).toBeLessThan(40);
  // Progress only ever goes forward, from 0 to 1.
  expect(progress[progress.length - 1]).toBeCloseTo(1, 2);
  expect(progress.every((value, index) => index === 0 || value >= progress[index - 1])).toBe(true);
});

test('any scroll, tap or key from the visitor takes over, and play carries on from where they are', () => {
  desktopPage();
  const onStatus = jest.fn();
  const tour = createTour(plan, { onStatus });

  tour.play();
  run(1);
  window.dispatchEvent(new Event('wheel'));
  expect(tour.getStatus()).toBe('paused');
  expect(frame).toBeNull();

  // The visitor scrolls on by hand, then asks for the tour again.
  setScroll(2000);
  tour.play();
  run(0.5);
  expect(window.scrollY).toBeGreaterThan(2000);
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
  expect(tour.getStatus()).toBe('paused');

  tour.play();
  document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  expect(tour.getStatus()).toBe('paused');

  // A key that does not scroll is not a takeover.
  tour.play();
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
  expect(tour.getStatus()).toBe('playing');
  tour.dispose();
});

test('using the tour controls themselves does not count as taking over', () => {
  desktopPage();
  const control = document.createElement('button');
  control.setAttribute('data-tour-control', '');
  document.body.appendChild(control);
  const tour = createTour(plan);
  tour.play();
  control.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  control.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
  expect(tour.getStatus()).toBe('playing');
  tour.toggle();
  expect(tour.getStatus()).toBe('paused');
  tour.toggle();
  expect(tour.getStatus()).toBe('playing');
  tour.dispose();
});

test('a jump made by something else (the scrollbar, the chapter rail) pauses the tour', () => {
  desktopPage();
  const tour = createTour(plan);
  tour.play();
  run(1);
  setScroll(window.scrollY + 900);
  run(0.1);
  expect(tour.getStatus()).toBe('paused');
});

test('waits while a dialog or the menu has the page locked, then carries on', () => {
  desktopPage();
  const tour = createTour(plan);
  tour.play();
  run(1);
  const before = window.scrollY;
  document.documentElement.classList.add('scroll-locked');
  run(2);
  expect(window.scrollY).toBe(before);
  expect(tour.getStatus()).toBe('playing');
  document.documentElement.classList.remove('scroll-locked');
  run(1);
  expect(window.scrollY).toBeGreaterThan(before);
  tour.dispose();
});

test('asked to play at the end, it returns to the top and starts again', () => {
  desktopPage();
  setScroll(6000);
  const tour = createTour(plan);
  tour.play();
  expect(scrollToTarget).toHaveBeenCalledWith(0, expect.any(Object));
  // Still rewinding: the tour leaves the page alone.
  run(0.5);
  expect(setScrollPosition).not.toHaveBeenCalled();
  setScroll(0);
  run(1);
  expect(window.scrollY).toBeGreaterThan(0);
  expect(tour.getStatus()).toBe('playing');
  tour.dispose();
});

test('does nothing on a page with none of the planned sections', () => {
  const onStatus = jest.fn();
  const tour = createTour(plan, { onStatus });
  tour.play();
  expect(onStatus).not.toHaveBeenCalled();
  expect(addTicker).not.toHaveBeenCalled();
});
