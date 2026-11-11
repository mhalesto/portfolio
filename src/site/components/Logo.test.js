import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Logo from './Logo';
import Header from './Header';
import Spaceman from './Spaceman';

jest.mock('../scroll', () => ({ setScrollLocked: jest.fn() }));

test('the mark is decorative: no text of its own for a screen reader', () => {
  render(<Logo />);
  // An empty alt takes the image out of the accessibility tree.
  expect(document.querySelector('.logo__img')).toHaveAttribute('alt', '');
  expect(screen.queryByAltText(/.+/)).toBeNull();
  expect(document.querySelector('.logo__sheen')).toHaveAttribute('aria-hidden', 'true');
});

test('the home link is still named by its words, with the mark inside it', () => {
  render(<MemoryRouter><Header /></MemoryRouter>);
  const home = screen.getByRole('link', { name: /Halalisani Mbanjwa, home/i });
  expect(home).toHaveAttribute('href', '/');
  expect(home.querySelector('.logo__img')).not.toBeNull();
});

test('the astronaut is scenery: hidden from assistive technology and out of sight until measured', () => {
  render(<div className="hero__sticky"><Spaceman /><h1 className="hero__title">Name</h1></div>);
  const spaceman = document.querySelector('.spaceman');
  expect(spaceman).toHaveAttribute('aria-hidden', 'true');
  expect(screen.queryByRole('img')).toBeNull();
  // jsdom lays nothing out, so there is nowhere to put him yet: he must not show at 0,0.
  expect(spaceman).not.toHaveClass('is-placed');
});

test('if the image cannot be had, the initials stand in instead of a broken picture', () => {
  render(<MemoryRouter><Header /></MemoryRouter>);
  const home = screen.getByRole('link', { name: /Halalisani Mbanjwa, home/i });
  fireEvent.error(home.querySelector('.logo__img'));
  expect(home.querySelector('.logo__img')).toBeNull();
  expect(home).toHaveTextContent('HM');
  // Still named by its words, not by the stand-in.
  expect(screen.getByRole('link', { name: /Halalisani Mbanjwa, home/i })).toBe(home);
});
