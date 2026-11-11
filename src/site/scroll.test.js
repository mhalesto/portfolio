import Lenis from 'lenis';
import { prefersReducedMotion } from './motion';
import { addTicker } from './ticker';
import {
  haltScroll, onScrollIntent, scrollToTarget, setScrollLocked, setScrollPosition, startSmoothScroll, stopSmoothScroll,
} from './scroll';

jest.mock('./ticker', () => ({ addTicker: jest.fn(() => jest.fn()) }));
jest.mock('./motion', () => ({ prefersReducedMotion: jest.fn(() => false) }));
jest.mock('lenis', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    on: jest.fn(), raf: jest.fn(), stop: jest.fn(), start: jest.fn(), scrollTo: jest.fn(), destroy: jest.fn(),
  })),
}));

beforeEach(() => {
  jest.clearAllMocks();
  addTicker.mockImplementation(() => jest.fn());
  Lenis.mockImplementation(() => ({
    on: jest.fn(), raf: jest.fn(), stop: jest.fn(), start: jest.fn(), scrollTo: jest.fn(), destroy: jest.fn(),
  }));
  prefersReducedMotion.mockReturnValue(false);
  window.scrollTo = jest.fn();
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 400 });
});

afterEach(() => {
  stopSmoothScroll();
  ['menu', 'dialog'].forEach(owner => setScrollLocked(false, owner));
  document.body.innerHTML = '';
});

test('reduced-motion chapter jumps retain the same offset without animated scrolling', () => {
  prefersReducedMotion.mockReturnValue(true);
  const chapter = document.createElement('section');
  chapter.id = 'app-clipaura';
  chapter.getBoundingClientRect = () => ({ top: 300 });
  document.body.appendChild(chapter);
  scrollToTarget('#app-clipaura', { offset: 120 });
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 820, behavior: 'instant' });
});

test('native scrolling supports immediate numeric destinations and ignores missing selectors', () => {
  scrollToTarget(800, { offset: -80, immediate: true });
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 720, behavior: 'instant' });
  window.scrollTo.mockClear();
  scrollToTarget('#missing');
  scrollToTarget('#[');
  expect(window.scrollTo).not.toHaveBeenCalled();
});

test('closing one overlay preserves another overlay lock, including while Lenis loads', async () => {
  setScrollLocked(true, 'menu');
  const starting = startSmoothScroll();
  setScrollLocked(true, 'dialog');
  setScrollLocked(false, 'menu');
  await starting;
  const lenis = Lenis.mock.results[0].value;
  expect(lenis.stop).toHaveBeenCalled();
  expect(document.documentElement).toHaveClass('scroll-locked');
  expect(lenis.start).not.toHaveBeenCalled();
  setScrollLocked(false, 'dialog');
  expect(document.documentElement).not.toHaveClass('scroll-locked');
  expect(lenis.start).toHaveBeenCalledTimes(1);
});

test('whoever is driving the scroll hears about a jump before it starts, until it stops listening', () => {
  // How many scrolls had already happened each time the listener was told.
  const scrollsBefore = [];
  const listener = jest.fn(() => scrollsBefore.push(window.scrollTo.mock.calls.length));
  const stopListening = onScrollIntent(listener);
  scrollToTarget(600);
  expect(listener).toHaveBeenCalledTimes(1);
  expect(window.scrollTo).toHaveBeenCalledTimes(1);
  // Told first, while nothing has moved yet, so it can stand down in time.
  expect(scrollsBefore).toEqual([0]);
  // A listener may remove itself while it is being told.
  const once = jest.fn(() => removeOnce());
  const removeOnce = onScrollIntent(once);
  scrollToTarget(700);
  scrollToTarget(800);
  expect(once).toHaveBeenCalledTimes(1);
  stopListening();
  scrollToTarget(900);
  expect(listener).toHaveBeenCalledTimes(3);
});

test('putting the page somewhere at once goes through Lenis when it is running', async () => {
  setScrollPosition(1234.5);
  expect(window.scrollTo).toHaveBeenLastCalledWith(0, 1234.5);
  setScrollPosition(-50);
  expect(window.scrollTo).toHaveBeenLastCalledWith(0, 0);

  await startSmoothScroll();
  const lenis = Lenis.mock.results[0].value;
  window.scrollTo.mockClear();
  setScrollPosition(3807);
  expect(lenis.scrollTo).toHaveBeenLastCalledWith(3807, { immediate: true, force: true });
  expect(window.scrollTo).not.toHaveBeenCalled();
});

test('an eased scroll can be stopped where it is, but a locked page is left locked', async () => {
  // Native smooth scrolling: scrolling to where the page already is cancels it.
  haltScroll();
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 400, behavior: 'instant' });

  await startSmoothScroll();
  const lenis = Lenis.mock.results[0].value;
  haltScroll();
  expect(lenis.stop).toHaveBeenCalledTimes(1);
  expect(lenis.start).toHaveBeenCalledTimes(1);

  // A dialog has the page: restarting Lenis here would unlock scrolling under it.
  setScrollLocked(true, 'dialog');
  lenis.stop.mockClear();
  lenis.start.mockClear();
  haltScroll();
  expect(lenis.stop).not.toHaveBeenCalled();
  expect(lenis.start).not.toHaveBeenCalled();
});
