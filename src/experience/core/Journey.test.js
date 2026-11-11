import { Journey } from './Journey';

const VIEWPORT = 800;

// jsdom has no layout, so each section reports the box the test gives it.
function section(top, height, attributes = {}) {
  const element = document.createElement('section');
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  element.getBoundingClientRect = () => ({ top: top - window.scrollY, bottom: top + height - window.scrollY, height });
  return element;
}

function page(...sections) {
  const root = document.createElement('main');
  sections.forEach(element => root.appendChild(element));
  return root;
}

let innerHeight;
beforeEach(() => {
  innerHeight = window.innerHeight;
  window.innerHeight = VIEWPORT;
});
afterEach(() => {
  window.innerHeight = innerHeight;
});

test('a held section parks the camera for the middle of its pin, then travels to the next station', () => {
  // Two sections of two viewports each: pinned for one viewport, 70% of it parked.
  const journey = new Journey(page(
    section(0, 1600, { 'data-station': '0', 'data-hold': '0.7' }),
    section(1600, 1600, { 'data-station': '1', 'data-hold': '0.7' }),
  ));
  expect(journey.stationAt(0)).toBe(0);
  expect(journey.stationAt(400)).toBe(0);
  expect(journey.stationAt(680)).toBe(0);
  // Halfway between the end of one park (680) and the start of the next (1720).
  expect(journey.stationAt(1200)).toBeCloseTo(0.5, 5);
  expect(journey.stationAt(1720)).toBe(1);
  expect(journey.stationAt(5000)).toBe(1);
  expect(journey.holdProgress(1, 1600)).toBe(0);
  expect(journey.holdProgress(1, 2000)).toBeCloseTo(0.5, 5);
  expect(journey.holdProgress(1, 2400)).toBe(1);
  journey.dispose();
});

test('the canvas counts as covered only while opaque content fills the whole viewport', () => {
  const journey = new Journey(page(
    section(0, 1600, { 'data-station': '0' }),
    section(1600, 2000, { 'data-cover': '' }),
    section(3600, 1600, { 'data-station': '1' }),
  ));
  expect(journey.isCovered(1500, VIEWPORT)).toBe(false);
  expect(journey.isCovered(1600, VIEWPORT)).toBe(true);
  expect(journey.isCovered(2800, VIEWPORT)).toBe(true);
  // One pixel of the next section showing is enough to need the canvas again.
  expect(journey.isCovered(2801, VIEWPORT)).toBe(false);
  // A taller viewport (a phone whose bars have retracted) sees past the block sooner.
  expect(journey.isCovered(2800, VIEWPORT + 60)).toBe(false);
  journey.dispose();
});

test('opaque blocks that touch are treated as one, and a gap between them is not covered', () => {
  const journey = new Journey(page(
    section(1000, 500, { 'data-cover': '' }),
    section(1500, 500, { 'data-cover': '' }),
    section(2300, 900, { 'data-cover': '' }),
  ));
  // Neither of the first two fills the viewport alone; together they do.
  expect(journey.isCovered(1100, VIEWPORT)).toBe(true);
  expect(journey.isCovered(1300, VIEWPORT)).toBe(false);
  expect(journey.isCovered(2350, VIEWPORT)).toBe(true);
  journey.dispose();
});

test('measuring again tells the scene, so it can re-frame its worlds', () => {
  const journey = new Journey(page(section(0, 1600, { 'data-station': '0' })));
  const onMeasure = jest.fn();
  journey.onMeasure = onMeasure;
  journey.measure();
  expect(onMeasure).toHaveBeenCalledTimes(1);
  journey.dispose();
});
