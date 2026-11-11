import { fireEvent, render, screen } from '@testing-library/react';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import SiteShell from './SiteShell';
import { resetScroll, setScrollPosition, startSmoothScroll, stopSmoothScroll } from '../scroll';
import { forgetScroll } from '../scrollMemory';

jest.mock('../scroll', () => ({
  resetScroll: jest.fn(),
  setScrollPosition: jest.fn(),
  startSmoothScroll: jest.fn(),
  stopSmoothScroll: jest.fn(),
  setScrollLocked: jest.fn(),
}));
jest.mock('./Cursor', () => () => null);

const Journey = () => <SiteShell><main>The journey</main></SiteShell>;

// initialIndex 1 puts the visitor on the product page with the journey behind them.
const renderSite = initialIndex => render(
  <MemoryRouter initialEntries={['/', '/product']} initialIndex={initialIndex}>
    <Routes>
      <Route path="/" element={<Journey />} />
      <Route path="/product" element={<Link to="/">Home</Link>} />
    </Routes>
  </MemoryRouter>,
);

const scrollTo = y => {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true });
  fireEvent.scroll(window);
};

beforeEach(() => {
  jest.clearAllMocks();
  forgetScroll();
  scrollTo(0);
});

test('a page opens at the top with the dark theme and smooth scrolling', () => {
  const { unmount } = renderSite(0);
  expect(document.documentElement).toHaveClass('theme-dark');
  expect(resetScroll).toHaveBeenCalledTimes(1);
  expect(setScrollPosition).not.toHaveBeenCalled();
  expect(startSmoothScroll).toHaveBeenCalledTimes(1);
  unmount();
  expect(document.documentElement).not.toHaveClass('theme-dark');
  expect(stopSmoothScroll).toHaveBeenCalledTimes(1);
});

test('going back to a page returns to where the visitor left it', () => {
  // Read down to a chapter, then leave.
  const first = renderSite(0);
  scrollTo(3807);
  first.unmount();
  jest.clearAllMocks();

  // The same history entry opened again by Back or Forward.
  renderSite(0);
  expect(setScrollPosition).toHaveBeenCalledWith(3807);
  expect(resetScroll).not.toHaveBeenCalled();
});

test('following a link to a page starts at the top, even one visited before', () => {
  const first = renderSite(0);
  scrollTo(3807);
  first.unmount();
  jest.clearAllMocks();

  renderSite(1);
  fireEvent.click(screen.getByRole('link', { name: 'Home' }));
  expect(screen.getByText('The journey')).toBeInTheDocument();
  expect(resetScroll).toHaveBeenCalledTimes(1);
  expect(setScrollPosition).not.toHaveBeenCalled();
});

test('scrolling after the page has gone is not recorded against it', () => {
  const first = renderSite(0);
  scrollTo(500);
  first.unmount();
  // The next page resets the window; that must not overwrite the memory.
  scrollTo(0);
  jest.clearAllMocks();
  renderSite(0);
  expect(setScrollPosition).toHaveBeenCalledWith(500);
});
