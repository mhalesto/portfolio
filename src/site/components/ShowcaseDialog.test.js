import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ShowcaseDialog from './ShowcaseDialog';
import { setScrollLocked } from '../scroll';

jest.mock('../scroll', () => ({ setScrollLocked: jest.fn() }));
const gallery = {
  title: 'Sample templates',
  images: ['Atlas', 'Oxford'].map(name => ({ src: `/${name}.webp`, alt: `${name} résumé`, caption: name, width: 640, height: 905 })),
};
function Gallery() {
  const [open, setOpen] = useState(false);
  return <div>
    <button onClick={() => setOpen(true)}>View samples</button>
    <main>Background content</main>
    <ShowcaseDialog showcase={open ? gallery : null} onClose={() => setOpen(false)} />
  </div>;
}

test('preview isolates the background, cycles real images, and restores focus on Escape', () => {
  render(<Gallery />);
  const trigger = screen.getByRole('button', { name: 'View samples' });
  trigger.focus();
  fireEvent.click(trigger);
  expect(screen.getByRole('dialog', { name: 'Sample templates' })).toBeInTheDocument();
  expect(document.querySelector('main')).toHaveAttribute('inert');
  expect(screen.getByRole('button', { name: 'Close preview' })).toHaveFocus();
  fireEvent.click(screen.getByRole('button', { name: 'Next example' }));
  expect(screen.getByRole('img', { name: 'Oxford résumé' })).toHaveAttribute('src', '/Oxford.webp');
  fireEvent.keyDown(window, { key: 'ArrowRight' });
  expect(screen.getByRole('img', { name: 'Atlas résumé' })).toBeInTheDocument();
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(document.querySelector('main')).not.toHaveAttribute('inert');
  expect(trigger).toHaveFocus();
  expect(setScrollLocked).toHaveBeenLastCalledWith(false, 'showcase');
});

test('Tab and Shift-Tab stay inside the preview controls', () => {
  render(<Gallery />);
  fireEvent.click(screen.getByRole('button', { name: 'View samples' }));
  const close = screen.getByRole('button', { name: 'Close preview' });
  const full = screen.getByRole('link', { name: 'Open full size' });
  close.focus();
  fireEvent.keyDown(close, { key: 'Tab', shiftKey: true });
  expect(full).toHaveFocus();
  fireEvent.keyDown(full, { key: 'Tab' });
  expect(close).toHaveFocus();
});
