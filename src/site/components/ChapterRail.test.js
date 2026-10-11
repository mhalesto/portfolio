import { fireEvent, render, screen } from '@testing-library/react';
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
