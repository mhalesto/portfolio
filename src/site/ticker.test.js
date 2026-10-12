import { addTicker } from './ticker';

let queued;
let nextId;
let removers;
const originalHidden = Object.getOwnPropertyDescriptor(document, 'hidden');

const hidden = value => {
  Object.defineProperty(document, 'hidden', { configurable: true, value });
  document.dispatchEvent(new Event('visibilitychange'));
};
const tick = time => {
  const callbacks = [...queued.values()];
  queued.clear();
  callbacks.forEach(callback => callback(time));
};
const subscribe = (callback, priority) => {
  const remove = addTicker(callback, priority);
  removers.push(remove);
  return remove;
};

beforeEach(() => {
  queued = new Map();
  nextId = 0;
  removers = [];
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    queued.set(++nextId, callback);
    return nextId;
  });
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => queued.delete(id));
  hidden(false);
});

afterEach(() => {
  removers.forEach(remove => remove());
  jest.restoreAllMocks();
  if (originalHidden) Object.defineProperty(document, 'hidden', originalHidden);
  else delete document.hidden;
});

test('hidden tabs suspend work and resume without a large animation delta', () => {
  const callback = jest.fn();
  subscribe(callback);
  tick(100);
  hidden(true);
  expect(queued.size).toBe(0);
  tick(60000);
  expect(callback).toHaveBeenCalledTimes(1);
  hidden(false);
  expect(queued.size).toBe(1);
  tick(61000);
  expect(callback).toHaveBeenLastCalledWith(61000, 1 / 60);
});

test('an effect can remove itself without skipping the next effect in the frame', () => {
  const calls = [];
  const removeFirst = subscribe(() => { calls.push('scroll'); removeFirst(); }, -10);
  const removeSecond = subscribe(() => calls.push('scene'), 0);
  tick(100);
  expect(calls).toEqual(['scroll', 'scene']);
  tick(116);
  expect(calls).toEqual(['scroll', 'scene', 'scene']);
  removeSecond();
  expect(queued.size).toBe(0);
});

test('a scene mounted in a hidden tab waits until the tab is visible', () => {
  hidden(true);
  const callback = jest.fn();
  subscribe(callback);
  expect(queued.size).toBe(0);
  hidden(false);
  tick(100);
  expect(callback).toHaveBeenCalledTimes(1);
});
