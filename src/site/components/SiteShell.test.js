import { act, fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter, Link, MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
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

test('takes over scroll restoration while mounted and always hands it back to the browser', () => {
  // jsdom has no scrollRestoration; a browser keeps one per history entry.
  let mode = 'auto';
  Object.defineProperty(window.history, 'scrollRestoration', {
    configurable: true,
    get: () => mode,
    set: value => {
      mode = value;
    },
  });
  try {
    const first = renderSite(0);
    expect(mode).toBe('manual');
    first.unmount();
    expect(mode).toBe('auto');

    // Coming Back to an entry this shell had already set to manual: leaving it
    // again must still give the next page the browser's own restoration, not
    // "the previous value", which here is manual.
    mode = 'manual';
    const again = renderSite(0);
    expect(mode).toBe('manual');
    again.unmount();
    expect(mode).toBe('auto');
  } finally {
    delete window.history.scrollRestoration;
  }
});

test('positions are remembered against the entry that is current, even when it changes under a mounted page', () => {
  // The same page gains a new history entry (a link to itself with a query).
  function Filter() {
    const navigate = useNavigate();
    return <button type="button" onClick={() => navigate('/?filter=ios')}>Filter</button>;
  }
  const site = initialIndex => render(
    <MemoryRouter initialEntries={['/', '/?filter=ios']} initialIndex={initialIndex}>
      <Routes>
        <Route path="/" element={<SiteShell><Filter /></SiteShell>} />
      </Routes>
    </MemoryRouter>,
  );

  const first = site(0);
  scrollTo(1200);
  fireEvent.click(screen.getByRole('button', { name: 'Filter' }));
  // Still the same mounted page, now on a newer entry: read further down.
  scrollTo(2900);
  first.unmount();
  jest.clearAllMocks();

  // Back to the original entry: where it was when the visitor left it.
  site(0);
  expect(setScrollPosition).toHaveBeenCalledWith(1200);
});

test('two pages that share a router key do not share a remembered position', () => {
  // The first page of a visit and any entry the browser makes for an in-page
  // jump are both keyed "default" by the router. Here: Home, then Projects.
  const visit = path => render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<SiteShell><main>Home</main></SiteShell>} />
        <Route path="/projects" element={<SiteShell><main>Projects</main></SiteShell>} />
      </Routes>
    </MemoryRouter>,
  );
  const home = visit('/');
  scrollTo(8400);
  home.unmount();
  jest.clearAllMocks();

  // Projects opens on an entry with the same key and must not inherit 8400.
  visit('/projects');
  expect(setScrollPosition).not.toHaveBeenCalled();
  expect(resetScroll).toHaveBeenCalledTimes(1);
});

test('Back and Forward between two entries of the same page return to where each was left', () => {
  function Controls() {
    const navigate = useNavigate();
    return (
      <>
        <button type="button" onClick={() => navigate('/?filter=ios')}>Filter</button>
        <button type="button" onClick={() => navigate(-1)}>Back</button>
        <button type="button" onClick={() => navigate(1)}>Forward</button>
      </>
    );
  }
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<SiteShell><Controls /></SiteShell>} />
      </Routes>
    </MemoryRouter>,
  );
  scrollTo(1200);
  fireEvent.click(screen.getByRole('button', { name: 'Filter' }));
  // A new entry starts out where the page already is: nothing moves.
  expect(setScrollPosition).not.toHaveBeenCalled();
  scrollTo(2900);

  fireEvent.click(screen.getByRole('button', { name: 'Back' }));
  expect(setScrollPosition).toHaveBeenLastCalledWith(1200);
  scrollTo(1200);
  fireEvent.click(screen.getByRole('button', { name: 'Forward' }));
  expect(setScrollPosition).toHaveBeenLastCalledWith(2900);
  // The page never remounted to do it.
  expect(resetScroll).toHaveBeenCalledTimes(1);
});

test('an in-page jump lands where the browser put it, not where an earlier entry was read to', () => {
  window.history.replaceState(null, '', '/');
  const { unmount } = render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SiteShell><main id="main">Home</main></SiteShell>} />
      </Routes>
    </BrowserRouter>,
  );
  try {
    scrollTo(3000);
    jest.clearAllMocks();
    // What a click on the skip link does: the browser adds an entry of its own
    // (no state, so the router keys it "default" like the first page of the
    // visit), reports it as a history move and scrolls to the target. The
    // scroll event for that arrives a frame later.
    act(() => {
      window.history.pushState(null, '', '/#main');
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    });
    scrollTo(0);
    expect(setScrollPosition).not.toHaveBeenCalled();

    // Back to the entry before the jump: where it was read to.
    act(() => {
      window.history.replaceState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate', { state: null }));
    });
    expect(setScrollPosition).toHaveBeenLastCalledWith(3000);
  } finally {
    unmount();
    window.history.replaceState(null, '', '/');
  }
});
