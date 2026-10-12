import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { setScrollLocked } from '../scroll';

jest.mock('../scroll', () => ({ setScrollLocked: jest.fn() }));

const renderHeader = () => render(
  <MemoryRouter initialEntries={['/projects']}>
    <div>
      <Header tone="overlay" />
      <main><button type="button">Background action</button></main>
      <footer inert="">Previously unavailable content</footer>
    </div>
  </MemoryRouter>,
);

beforeEach(() => jest.clearAllMocks());

test('mobile menu focuses its links, contains keyboard focus and restores the menu button on Escape', () => {
  const { container } = renderHeader();
  const toggle = screen.getByRole('button', { name: 'Menu' });
  toggle.focus();
  fireEvent.click(toggle);
  const menu = screen.getByRole('navigation', { name: 'Menu' });
  const first = within(menu).getByRole('link', { name: /Home/ });
  const last = container.querySelector('.site-menu__foot a:last-child');

  expect(first).toHaveFocus();
  expect(container.querySelector('main')).toHaveAttribute('inert');
  expect(setScrollLocked).toHaveBeenCalledWith(true, 'mobile-menu');

  last.focus();
  fireEvent.keyDown(last, { key: 'Tab' });
  expect(toggle).toHaveFocus();
  fireEvent.keyDown(toggle, { key: 'Tab', shiftKey: true });
  expect(last).toHaveFocus();

  fireEvent.keyDown(last, { key: 'Escape' });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(toggle).toHaveFocus();
  expect(container.querySelector('main')).not.toHaveAttribute('inert');
  expect(container.querySelector('footer')).toHaveAttribute('inert');
  expect(setScrollLocked).toHaveBeenLastCalledWith(false, 'mobile-menu');
});

test('choosing the current page still closes the menu and releases its scroll lock', () => {
  renderHeader();
  const toggle = screen.getByRole('button', { name: 'Menu' });
  fireEvent.click(toggle);
  fireEvent.click(within(screen.getByRole('navigation', { name: 'Menu' })).getByRole('link', { name: /Projects/ }));
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(toggle).toHaveFocus();
  expect(setScrollLocked).toHaveBeenLastCalledWith(false, 'mobile-menu');
});

test('navigation and unmount both release only the menu-owned scroll lock', () => {
  const { unmount } = renderHeader();
  const toggle = screen.getByRole('button', { name: 'Menu' });
  fireEvent.click(toggle);
  fireEvent.click(within(screen.getByRole('navigation', { name: 'Menu' })).getByRole('link', { name: /Contact/ }));
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(setScrollLocked).toHaveBeenLastCalledWith(false, 'mobile-menu');

  fireEvent.click(toggle);
  unmount();
  expect(document.documentElement).not.toHaveClass('menu-open');
  expect(setScrollLocked).toHaveBeenLastCalledWith(false, 'mobile-menu');
});
