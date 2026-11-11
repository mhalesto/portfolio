import { fitPanels } from './useFitPanels';

// jsdom has no layout: give each element the measurements a browser would.
function pinnedPanel({ panelHeight, screenHeight, position = 'sticky', padding = [80, 30] }) {
  const pinned = document.createElement('div');
  pinned.style.position = position;
  pinned.style.paddingTop = `${padding[0]}px`;
  pinned.style.paddingBottom = `${padding[1]}px`;
  Object.defineProperty(pinned, 'clientHeight', { value: screenHeight });
  const panel = document.createElement('div');
  panel.className = 'panel';
  Object.defineProperty(panel, 'offsetHeight', { value: panelHeight });
  pinned.appendChild(panel);
  return { pinned, panel };
}

function page(...items) {
  const root = document.createElement('main');
  items.forEach(item => root.appendChild(item.pinned));
  document.body.appendChild(root);
  return root;
}

afterEach(() => {
  document.body.innerHTML = '';
});

test('a panel that fits its pinned screen is left at full size', () => {
  const item = pinnedPanel({ panelHeight: 480, screenHeight: 610 });
  fitPanels(page(item), '.panel');
  expect(item.panel.style.scale).toBe('');
});

test('a panel taller than its screen is scaled down just enough to fit', () => {
  // 610px screen less 110px of padding leaves 500px for a 525px panel.
  const item = pinnedPanel({ panelHeight: 525, screenHeight: 610 });
  fitPanels(page(item), '.panel');
  expect(Number(item.panel.style.scale)).toBeCloseTo(500 / 525, 3);
});

test('never scales below the floor, where text stops being readable', () => {
  const item = pinnedPanel({ panelHeight: 900, screenHeight: 500 });
  fitPanels(page(item), '.panel', 0.74);
  expect(Number(item.panel.style.scale)).toBe(0.74);
});

test('layouts that scroll their copy are not scaled, and an old scale is cleared', () => {
  const item = pinnedPanel({ panelHeight: 900, screenHeight: 500, position: 'relative' });
  item.panel.style.scale = '0.8';
  fitPanels(page(item), '.panel');
  expect(item.panel.style.scale).toBe('');
});

test('each panel is fitted on its own', () => {
  const short = pinnedPanel({ panelHeight: 400, screenHeight: 610 });
  const tall = pinnedPanel({ panelHeight: 625, screenHeight: 610 });
  fitPanels(page(short, tall), '.panel');
  expect(short.panel.style.scale).toBe('');
  expect(Number(tall.panel.style.scale)).toBeCloseTo(0.8, 3);
});
