import { act, render } from '@testing-library/react';
import Marquee from './Marquee';
import { addTicker } from '../ticker';

jest.mock('../ticker', () => ({ addTicker: jest.fn() }));
jest.mock('../scroll', () => ({ scrollState: { velocity: 0 } }));
jest.mock('../motion', () => ({ prefersReducedMotion: () => false }));

test('marquee animates only near the viewport and measures its width only when resized', () => {
  let onIntersection;
  let onResize;
  let update;
  const stop = jest.fn();
  const intersectionDisconnect = jest.fn();
  const resizeDisconnect = jest.fn();
  const OriginalIntersectionObserver = window.IntersectionObserver;
  const OriginalResizeObserver = window.ResizeObserver;
  window.IntersectionObserver = jest.fn(callback => {
    onIntersection = callback;
    return { observe: jest.fn(), disconnect: intersectionDisconnect };
  });
  window.ResizeObserver = jest.fn(callback => {
    onResize = callback;
    return { observe: jest.fn(), disconnect: resizeDisconnect };
  });
  addTicker.mockImplementation(callback => { update = callback; return stop; });
  const { container, unmount } = render(<Marquee items={['Apps', 'Websites']} />);
  const track = container.querySelector('.marquee__track');
  const measure = jest.fn(() => 1200);
  Object.defineProperty(track, 'scrollWidth', { get: measure });
  act(() => onResize());
  expect(addTicker).not.toHaveBeenCalled();
  act(() => onIntersection([{ isIntersecting: true }]));
  act(() => { update(100, 1 / 60); update(116, 1 / 60); });
  expect(track.style.transform).toContain('translate3d');
  expect(measure).toHaveBeenCalledTimes(1);
  act(() => onIntersection([{ isIntersecting: false }]));
  expect(stop).toHaveBeenCalledTimes(1);
  act(() => onIntersection([{ isIntersecting: true }]));
  expect(addTicker).toHaveBeenCalledTimes(2);
  unmount();
  expect(stop).toHaveBeenCalledTimes(2);
  expect(intersectionDisconnect).toHaveBeenCalledTimes(1);
  expect(resizeDisconnect).toHaveBeenCalledTimes(1);
  window.IntersectionObserver = OriginalIntersectionObserver;
  window.ResizeObserver = OriginalResizeObserver;
});
