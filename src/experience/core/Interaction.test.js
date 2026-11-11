import { PerspectiveCamera } from 'three';
import { Interaction } from './Interaction';

// No WebGL context is needed: exercise pointer lifecycle and coordinates at
// the raycaster boundary while keeping Three's ESM renderer out of jsdom.
jest.mock('three', () => ({
  PerspectiveCamera: class {},
  Raycaster: class {},
  Vector2: class {
    constructor(x = 0, y = 0) { this.set(x, y); }
    set(x, y) { this.x = x; this.y = y; return this; }
  },
}));

let interaction;
let canvas;
let target;
let bounds;

function pointer(type, { x = 300, y = 450, pointerId = 1, pointerType = 'touch' } = {}) {
  const event = new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button: 0 });
  Object.defineProperties(event, { pointerId: { value: pointerId }, pointerType: { value: pointerType } });
  canvas.dispatchEvent(event);
}

beforeEach(() => {
  canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  bounds = { left: 100, top: 50, width: 400, height: 800 };
  canvas.getBoundingClientRect = () => bounds;
  interaction = new Interaction({ canvas, camera: new PerspectiveCamera() });
  target = { object: { visible: true }, onPress: jest.fn(), onRelease: jest.fn(), onClick: jest.fn() };
  interaction.setTargets([target]);
  interaction.raycaster.setFromCamera = jest.fn();
  interaction.raycaster.intersectObject = jest.fn(() => [{ distance: 1 }]);
});

afterEach(() => {
  interaction.dispose();
  canvas.remove();
});

test('a touch claimed by native scrolling releases its icon without opening it', () => {
  pointer('pointerdown');
  expect(target.onPress).toHaveBeenCalledTimes(1);
  pointer('pointercancel');
  expect(target.onRelease).toHaveBeenCalledTimes(1);
  expect(target.onClick).not.toHaveBeenCalled();
  pointer('pointerup');
  expect(target.onRelease).toHaveBeenCalledTimes(1);

  pointer('pointerdown');
  pointer('pointerup');
  expect(target.onClick).toHaveBeenCalledTimes(1);
});

test('raycasting stays aligned with a canvas that is taller than the viewport and moves on scroll', () => {
  pointer('pointermove', { pointerType: 'mouse' });
  interaction.update();
  expect(interaction.ndc.x).toBeCloseTo(0);
  expect(interaction.ndc.y).toBeCloseTo(0);

  bounds = { ...bounds, top: -150 };
  interaction.update();
  expect(interaction.ndc.y).toBeCloseTo(-0.5);
  expect(interaction.raycaster.setFromCamera).toHaveBeenCalledTimes(2);
});

test('a second touch cannot release the active gesture and window blur cleans it up', () => {
  pointer('pointerdown');
  pointer('pointerup', { pointerId: 2 });
  expect(target.onRelease).not.toHaveBeenCalled();
  window.dispatchEvent(new Event('blur'));
  expect(target.onRelease).toHaveBeenCalledTimes(1);
  expect(target.onClick).not.toHaveBeenCalled();
});

test('a clean tap or click on empty space is reported, so the scene can answer it', () => {
  const onEmpty = jest.fn();
  interaction.onEmpty = onEmpty;
  // Nothing under the pointer.
  interaction.raycaster.intersectObject = jest.fn(() => []);

  pointer('pointerdown');
  expect(onEmpty).not.toHaveBeenCalled();
  pointer('pointerup');
  expect(onEmpty).toHaveBeenCalledTimes(1);
  expect(target.onClick).not.toHaveBeenCalled();
  // The scene reads the pointer position from ndc: centre of the canvas here.
  expect(interaction.ndc.x).toBeCloseTo(0);
  expect(interaction.ndc.y).toBeCloseTo(0);

  pointer('pointerdown', { pointerType: 'mouse' });
  pointer('pointerup', { pointerType: 'mouse' });
  expect(onEmpty).toHaveBeenCalledTimes(2);
});

test('a press on empty space that turns into a scroll or a drag is not a tap', () => {
  const onEmpty = jest.fn();
  interaction.onEmpty = onEmpty;
  interaction.raycaster.intersectObject = jest.fn(() => []);

  // The browser takes the touch for scrolling.
  pointer('pointerdown');
  pointer('pointercancel');
  pointer('pointerup');
  expect(onEmpty).not.toHaveBeenCalled();

  // The pointer travels before it lifts.
  pointer('pointerdown', { x: 300, y: 450 });
  pointer('pointerup', { x: 300, y: 520 });
  expect(onEmpty).not.toHaveBeenCalled();

  // Another finger lifting does not complete the first one's tap.
  pointer('pointerdown', { pointerId: 1 });
  pointer('pointerup', { pointerId: 2 });
  expect(onEmpty).not.toHaveBeenCalled();
  // Leaving the window abandons the press altogether.
  window.dispatchEvent(new Event('blur'));
  pointer('pointerup', { pointerId: 1 });
  expect(onEmpty).not.toHaveBeenCalled();
});

test('a press that lands on something is that thing\'s click, not a tap on empty space', () => {
  const onEmpty = jest.fn();
  interaction.onEmpty = onEmpty;
  pointer('pointerdown');
  pointer('pointerup');
  expect(target.onClick).toHaveBeenCalledTimes(1);
  expect(onEmpty).not.toHaveBeenCalled();
});

test('only a mouse over the page counts as hovering', () => {
  expect(interaction.hovering).toBe(false);
  pointer('pointermove', { pointerType: 'mouse' });
  expect(interaction.hovering).toBe(true);
  // A touch has no resting position to stir with.
  pointer('pointerdown', { pointerType: 'touch' });
  expect(interaction.hovering).toBe(false);
  pointer('pointerup', { pointerType: 'touch' });
  pointer('pointermove', { pointerType: 'mouse' });
  expect(interaction.hovering).toBe(true);
  window.dispatchEvent(new Event('blur'));
  expect(interaction.hovering).toBe(false);
});
