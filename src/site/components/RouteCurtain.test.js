import { act, fireEvent, render, screen } from '@testing-library/react';
import { Link, MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import RouteCurtain from './RouteCurtain';
import { scrollToTarget } from '../scroll';
import { travel } from '../transition';

jest.mock('../scroll', () => ({ scrollToTarget: jest.fn() }));

function Where() {
  const location = useLocation();
  return <p data-testid="where" data-key={location.key}>{location.pathname}</p>;
}

function OrbitIcon() {
  const navigate = useNavigate();
  return <button type="button" onClick={() => travel('/contact', navigate)}>Icon in the orbit</button>;
}

const renderSite = () => render(
  <MemoryRouter initialEntries={['/']}>
    <RouteCurtain />
    <Where />
    <Routes>
      <Route path="/" element={<><Link to="/">Logo</Link><Link to="/projects">Projects</Link><Link to="/#main">Skip to content</Link><OrbitIcon /></>} />
      <Route path="/projects" element={<Link to="/">Home</Link>} />
      <Route path="/contact" element={<Link to="/">Home</Link>} />
    </Routes>
  </MemoryRouter>,
);

// jsdom has no Web Animations. This stands in for element.animate(): each
// animation finishes only when the test says so.
let animations;
function installAnimations() {
  animations = [];
  HTMLElement.prototype.animate = jest.fn(function animate(keyframes) {
    let finish;
    const animation = {
      keyframes,
      cancel: jest.fn(),
      finished: new Promise(resolve => {
        finish = resolve;
      }),
    };
    animation.finish = () => finish();
    animations.push(animation);
    return animation;
  });
  HTMLElement.prototype.getAnimations = jest.fn(() => []);
  // The curtain also checks that animations report when they finish.
  window.Animation = function Animation() {};
  Object.defineProperty(window.Animation.prototype, 'finished', { configurable: true, get: () => Promise.resolve() });
}

const where = () => screen.getByTestId('where').textContent;
const panelAnimations = () => animations.filter(animation => 'transform' in animation.keyframes[0]);

beforeEach(() => {
  jest.clearAllMocks();
  // MemoryRouter keeps its own history; the click handler reads the real address.
  window.history.pushState({}, '', '/');
});

afterEach(() => {
  delete HTMLElement.prototype.animate;
  delete HTMLElement.prototype.getAnimations;
  delete window.Animation;
  jest.useRealTimers();
});

test('a link to the page already open returns to its top without adding a history entry', () => {
  renderSite();
  const key = screen.getByTestId('where').getAttribute('data-key');
  fireEvent.click(screen.getByRole('link', { name: 'Logo' }));
  expect(scrollToTarget).toHaveBeenCalledWith(0);
  // The router was not asked to navigate: same page, same entry.
  expect(where()).toBe('/');
  expect(screen.getByTestId('where').getAttribute('data-key')).toBe(key);
});

test('a modified click on such a link is left to the browser', () => {
  renderSite();
  const link = screen.getByRole('link', { name: 'Logo' });
  // jsdom cannot open a tab; what matters is that this handler did not claim the click.
  link.addEventListener('click', event => event.preventDefault());
  fireEvent.click(link, { ctrlKey: true });
  expect(scrollToTarget).not.toHaveBeenCalled();
});

test('without Web Animations a link changes page at once, as it always has', () => {
  renderSite();
  fireEvent.click(screen.getByRole('link', { name: 'Projects' }));
  expect(where()).toBe('/projects');
});

test('a link first draws the curtain over the page, then changes route, then lifts it', async () => {
  installAnimations();
  const { container } = renderSite();
  const panel = container.querySelector('.route-curtain');

  fireEvent.click(screen.getByRole('link', { name: 'Projects' }));
  // Still on the old page while the curtain rises over it.
  expect(where()).toBe('/');
  expect(panel.style.visibility).toBe('visible');
  expect(panelAnimations()).toHaveLength(1);

  // A second, impatient click changes nothing.
  fireEvent.click(screen.getByRole('link', { name: 'Projects' }));
  expect(panelAnimations()).toHaveLength(1);

  await act(async () => {
    panelAnimations()[0].finish();
  });
  expect(where()).toBe('/projects');
  // The reveal starts from fully covering and ends off the top of the screen.
  const reveal = panelAnimations()[1];
  expect(reveal.keyframes[0].transform).toBe('translate3d(0, 0, 0)');
  expect(reveal.keyframes[1].transform).toContain('-100%');

  await act(async () => {
    reveal.finish();
  });
  expect(panel.style.visibility).toBe('hidden');
});

test('moves that are not link clicks get the same exit', async () => {
  installAnimations();
  renderSite();
  fireEvent.click(screen.getByRole('button', { name: 'Icon in the orbit' }));
  expect(where()).toBe('/');
  await act(async () => {
    panelAnimations()[0].finish();
  });
  expect(where()).toBe('/contact');
});

test('a stalled animation never strands the visitor on the old page', () => {
  jest.useFakeTimers();
  installAnimations();
  renderSite();
  fireEvent.click(screen.getByRole('link', { name: 'Projects' }));
  expect(where()).toBe('/');
  act(() => {
    jest.advanceTimersByTime(2000);
  });
  expect(where()).toBe('/projects');
});

test('visitors who prefer reduced motion change page at once', () => {
  installAnimations();
  const matchMedia = window.matchMedia;
  window.matchMedia = query => ({ matches: query.includes('prefers-reduced-motion') });
  try {
    renderSite();
    fireEvent.click(screen.getByRole('link', { name: 'Projects' }));
    expect(where()).toBe('/projects');
    expect(animations).toHaveLength(0);
  } finally {
    window.matchMedia = matchMedia;
  }
});

test('an engine with animate() but not the rest of Web Animations changes page at once instead of crashing', () => {
  // Chromium 36 to 83 and Firefox 48 to 74: element.animate() exists, getAnimations() does not.
  HTMLElement.prototype.animate = jest.fn();
  renderSite();
  fireEvent.click(screen.getByRole('link', { name: 'Projects' }));
  expect(where()).toBe('/projects');
  expect(HTMLElement.prototype.animate).not.toHaveBeenCalled();
  // And on to another page: the app is still standing.
  window.history.pushState({}, '', '/projects');
  fireEvent.click(screen.getByRole('link', { name: 'Home' }));
  expect(where()).toBe('/');
});

test('an engine that throws part-way through still takes the visitor to the page', () => {
  installAnimations();
  HTMLElement.prototype.animate = jest.fn(() => {
    throw new Error('not today');
  });
  const { container } = renderSite();
  fireEvent.click(screen.getByRole('link', { name: 'Projects' }));
  expect(where()).toBe('/projects');
  expect(container.querySelector('.route-curtain').style.visibility).toBe('hidden');
  // Not left believing a page is still on its way out.
  HTMLElement.prototype.animate = jest.fn(() => {
    throw new Error('still not');
  });
  window.history.pushState({}, '', '/projects');
  fireEvent.click(screen.getByRole('link', { name: 'Home' }));
  expect(where()).toBe('/');
});

test('an in-page jump is not a page change: no curtain', () => {
  installAnimations();
  renderSite();
  // The skip link leaves the path alone and only adds a #target.
  fireEvent.click(screen.getByRole('link', { name: 'Skip to content' }));
  expect(where()).toBe('/');
  expect(animations).toHaveLength(0);
});
