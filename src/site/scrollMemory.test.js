import { forgetScroll, recallScroll, rememberScroll } from './scrollMemory';

beforeEach(() => forgetScroll());

test('recalls the last position remembered for a history entry', () => {
  expect(recallScroll('a')).toBeNull();
  rememberScroll('a', 1200.6);
  rememberScroll('b', 40);
  rememberScroll('a', 3807);
  expect(recallScroll('a')).toBe(3807);
  expect(recallScroll('b')).toBe(40);
});

test('ignores positions that make no sense', () => {
  rememberScroll('', 100);
  rememberScroll('a', NaN);
  rememberScroll('b', -20);
  expect(recallScroll('')).toBeNull();
  expect(recallScroll('a')).toBeNull();
  expect(recallScroll('b')).toBe(0);
});

test('keeps the most recently used entries when it has to forget some', () => {
  for (let i = 0; i < 60; i += 1) rememberScroll(`entry-${i}`, i);
  // Touching the oldest entry makes it the newest.
  rememberScroll('entry-0', 999);
  rememberScroll('one-more', 1);
  expect(recallScroll('entry-0')).toBe(999);
  expect(recallScroll('entry-1')).toBeNull();
  expect(recallScroll('entry-2')).toBe(2);
  expect(recallScroll('one-more')).toBe(1);
});
