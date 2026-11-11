import { act, fireEvent, render, screen } from '@testing-library/react';
import { Link, MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import RouteCurtain from './RouteCurtain';
import { travel } from '../transition';

function Where() {
  return <p data-testid="where">{useLocation().pathname}</p>;
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
      <Route path="/" element={<><Link to="/projects">Projects</Link><OrbitIcon /></>} />
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
}

const where = () => screen.getByTestId('where').textContent;
const panelAnimations = () => animations.filter(animation => 'transform' in animation.keyframes[0]);

afterEach(() => {
  delete HTMLElement.prototype.animate;
  delete HTMLElement.prototype.getAnimations;
  jest.useRealTimers();
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
