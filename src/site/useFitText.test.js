import { useRef } from 'react';
import { render } from '@testing-library/react';
import useFitText from './useFitText';

// jsdom has no layout: the container reports a width and the word reports a
// width proportional to its font size, like a real line of text.
const EM_WIDTH = 4; // the word is four ems wide

function Word({ options }) {
  const ref = useRef(null);
  useFitText(ref, options);
  return (
    <div data-testid="box">
      <span ref={ref}>Halalisani</span>
    </div>
  );
}

let clientWidth;
let rect;
beforeEach(() => {
  clientWidth = jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(function width() {
    return this.tagName === 'DIV' ? 1000 : 0;
  });
  rect = jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function box() {
    return { width: (parseFloat(this.style.fontSize) || 16) * EM_WIDTH };
  });
});
afterEach(() => {
  clientWidth.mockRestore();
  rect.mockRestore();
});

test('sizes the text so one line spans its container', () => {
  const { container } = render(<Word />);
  // 1000px wide container / 4em wide word.
  expect(container.querySelector('span').style.fontSize).toBe('250.00px');
});

test('trims the blank side bearings so the ink, not the box, reaches the edges', () => {
  const { container } = render(<Word options={{ trim: 0.1 }} />);
  expect(parseFloat(container.querySelector('span').style.fontSize)).toBeCloseTo(1000 / 3.9, 1);
});

test('stays inside the size limits', () => {
  const { container, rerender } = render(<Word options={{ max: 120 }} />);
  expect(container.querySelector('span').style.fontSize).toBe('120.00px');
  rerender(<Word options={{ min: 300, max: 640 }} />);
  expect(container.querySelector('span').style.fontSize).toBe('300.00px');
});

test('leaves the CSS size alone when nothing can be measured', () => {
  clientWidth.mockImplementation(() => 0);
  const { container } = render(<Word />);
  expect(container.querySelector('span').style.fontSize).toBe('');
});
