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
