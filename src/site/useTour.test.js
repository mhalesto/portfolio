import { act, render, screen } from '@testing-library/react';
import useTour from './useTour';
import { createTour } from './tour';

jest.mock('./tour', () => ({ createTour: jest.fn() }));

let callbacks;
let controller;
beforeEach(() => {
  jest.clearAllMocks();
  controller = { play: jest.fn(), pause: jest.fn(), toggle: jest.fn(), dispose: jest.fn() };
  createTour.mockImplementation((plan, options) => {
    callbacks = options;
    return controller;
  });
});

const plan = [{ id: 'top', hold: 6 }];

function Controls({ enabled, onStart }) {
  const tour = useTour(plan, enabled, { onStart });
  return (
    <div>
      <button type="button" onClick={tour.toggle}>{tour.available ? tour.status : 'unavailable'}</button>
      <span data-testid="bar" ref={tour.barRef} />
    </div>
  );
}

test('without the 3D journey there is no tour', () => {
  render(<Controls enabled={false} />);
  expect(createTour).not.toHaveBeenCalled();
  expect(screen.getByRole('button')).toHaveTextContent('unavailable');
});

test('reports the tour status, moves the progress bar directly and announces the first start', () => {
  const onStart = jest.fn();
  const { unmount } = render(<Controls enabled onStart={onStart} />);
  expect(createTour).toHaveBeenCalledWith(plan, expect.any(Object));
  expect(screen.getByRole('button')).toHaveTextContent('idle');

  act(() => callbacks.onStatus('playing'));
  expect(screen.getByRole('button')).toHaveTextContent('playing');
  expect(onStart).toHaveBeenCalledTimes(1);

  callbacks.onProgress(0.25);
  expect(screen.getByTestId('bar').style.transform).toBe('scaleX(0.2500)');
  callbacks.onProgress(1.4);
  expect(screen.getByTestId('bar').style.transform).toBe('scaleX(1.0000)');

  act(() => callbacks.onStatus('paused'));
  expect(screen.getByRole('button')).toHaveTextContent('paused');
  expect(onStart).toHaveBeenCalledTimes(1);

  screen.getByRole('button').click();
  expect(controller.toggle).toHaveBeenCalledTimes(1);

  unmount();
  expect(controller.dispose).toHaveBeenCalledTimes(1);
});

test('losing the 3D scene part-way withdraws the tour', () => {
  const { rerender } = render(<Controls enabled />);
  act(() => callbacks.onStatus('playing'));
  rerender(<Controls enabled={false} />);
  expect(controller.dispose).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button')).toHaveTextContent('unavailable');
});
