import { act, fireEvent, render, screen } from '@testing-library/react';
import ChapterRail from './ChapterRail';
import { scrollToTarget } from '../scroll';

jest.mock('../scroll', () => ({ scrollToTarget: jest.fn() }));

test('chapter picker uses the current viewport when jumping after a resize', () => {
  const oldHeight = window.innerHeight;
  const items = [{ id: 'top', label: 'Intro' }, { id: 'work', label: 'Work', offset: () => window.innerHeight * 0.35 }];
  render(<ChapterRail items={items} />);
  window.innerHeight = 900;
  // The desktop rail is also available to keyboard navigation.
  fireEvent.click(screen.getByRole('button', { name: 'Go to Work (2 of 2)' }));
  expect(scrollToTarget).toHaveBeenLastCalledWith('#work', { offset: 315 });
  window.innerHeight = 600;
  fireEvent.change(screen.getByLabelText('Jump to a section'), { target: { value: 'work' } });
  expect(scrollToTarget).toHaveBeenLastCalledWith('#work', { offset: 210 });
  window.innerHeight = oldHeight;
});

const items = [{ id: 'top', label: 'Intro' }, { id: 'work', label: 'Work' }];
const makeTour = overrides => ({ available: true, status: 'idle', toggle: jest.fn(), pause: jest.fn(), ...overrides });

test('offers no tour control unless a tour is available', () => {
  const { rerender } = render(<ChapterRail items={items} />);
  expect(screen.queryByRole('button', { name: /tour/i })).toBeNull();
  rerender(<ChapterRail items={items} tour={makeTour({ available: false })} />);
  expect(screen.queryByRole('button', { name: /tour/i })).toBeNull();
});

test('the rail and the phone picker both carry the tour control, named for what it will do next', () => {
  const tour = makeTour();
  const { rerender } = render(<ChapterRail items={items} tour={tour} />);
  const controls = screen.getAllByRole('button', { name: 'Play the tour' });
  // One in the desktop rail, one in the phone picker.
  expect(controls).toHaveLength(2);
  controls.forEach(control => {
    // The tour must not treat a press on its own control as the visitor taking over.
    expect(control).toHaveAttribute('data-tour-control');
    // The name changes with the state, so it is not also a pressed toggle.
    expect(control).not.toHaveAttribute('aria-pressed');
  });
  // The text the rail shows on hover is the button's name, not a hidden extra.
  expect(screen.getByText('Play the tour')).not.toHaveAttribute('aria-hidden');
  fireEvent.click(controls[0]);
  fireEvent.click(controls[1]);
  expect(tour.toggle).toHaveBeenCalledTimes(2);

  rerender(<ChapterRail items={items} tour={makeTour({ status: 'playing' })} />);
  expect(screen.getAllByRole('button', { name: 'Pause the tour' })).toHaveLength(2);
  expect(screen.queryByRole('button', { name: 'Play the tour' })).toBeNull();
});

test('choosing a chapter by hand pauses the tour', () => {
  const tour = makeTour({ status: 'playing' });
  render(<ChapterRail items={items} tour={tour} />);
  fireEvent.click(screen.getByRole('button', { name: 'Go to Work (2 of 2)' }));
  expect(tour.pause).toHaveBeenCalledTimes(1);
  expect(scrollToTarget).toHaveBeenLastCalledWith('#work', { offset: 0 });
  fireEvent.change(screen.getByLabelText('Jump to a section'), { target: { value: 'top' } });
  expect(tour.pause).toHaveBeenCalledTimes(2);
});

test('when several reports about the footer arrive together, the newest one wins', () => {
  const observers = [];
  window.IntersectionObserver = class {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      observers.push(this);
    }

    observe() {}

    disconnect() {}
  };
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  document.body.appendChild(footer);
  try {
    render(<ChapterRail items={items} />);
    const rail = screen.getByRole('navigation', { name: 'Sections' });
    const footerObserver = observers.find(observer => observer.options.threshold === 0.2);
    // Frames ran late: the visitor flicked down to the footer and back up
    // before either change was delivered. The rail must not stay hidden.
    act(() => footerObserver.callback([{ isIntersecting: true }, { isIntersecting: false }]));
    expect(rail).not.toHaveClass('is-hidden');
    act(() => footerObserver.callback([{ isIntersecting: false }, { isIntersecting: true }]));
    expect(rail).toHaveClass('is-hidden');
  } finally {
    footer.remove();
    delete window.IntersectionObserver;
  }
});
