import Lenis from 'lenis';
import { prefersReducedMotion } from './motion';
import { addTicker } from './ticker';
import { scrollToTarget, setScrollLocked, startSmoothScroll, stopSmoothScroll } from './scroll';

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
