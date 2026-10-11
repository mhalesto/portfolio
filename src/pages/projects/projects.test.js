import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Projects from './index';
import { addTicker } from '../../site/ticker';
import { hasFinePointer, prefersReducedMotion, supportsWebGL } from '../../site/motion';
import { scrollToTarget } from '../../site/scroll';
import { apps, webProjects } from '../../site/data';

jest.mock('../../site/components/SiteShell', () => ({ children }) => <div>{children}</div>);
jest.mock('../../site/useReveal', () => jest.fn());
jest.mock('../../site/ticker', () => ({ addTicker: jest.fn() }));
jest.mock('../../site/motion', () => ({
  hasFinePointer: jest.fn(),
  prefersReducedMotion: jest.fn(),
  supportsWebGL: jest.fn(),
}));
jest.mock('../../site/scroll', () => ({ scrollToTarget: jest.fn() }));

const visit = () => render(<MemoryRouter><Projects /></MemoryRouter>);

beforeEach(() => {
  jest.clearAllMocks();
  hasFinePointer.mockReturnValue(true);
  prefersReducedMotion.mockReturnValue(false);
  supportsWebGL.mockReturnValue(false);
  addTicker.mockReturnValue(jest.fn());
});

test('the index shortcut moves focus to the index and filters announce the visible result count', () => {
  const { container } = visit();
  fireEvent.click(screen.getByRole('link', { name: 'Browse projects' }));
  expect(scrollToTarget).toHaveBeenCalledWith('#work-index', { offset: -84 });
  expect(screen.getByRole('heading', { name: 'All projects' })).toHaveFocus();

  fireEvent.click(screen.getByRole('button', { name: /Websites/ }));
  expect(screen.getByRole('status')).toHaveTextContent(`${webProjects.length} projects`);
  expect(container.querySelectorAll('.index-row')).toHaveLength(webProjects.length);
  expect(screen.queryByText(apps[0].name, { selector: '.index-row__name' })).not.toBeInTheDocument();
});

test('hover previews load only the selected image and stop animation on leave or scroll', () => {
  const dispose = jest.fn();
  addTicker.mockReturnValue(dispose);
  const { container } = visit();
  const row = container.querySelector('.index-row');
  expect(container.querySelector('.hover-preview')).toBeNull();
  expect(addTicker).not.toHaveBeenCalled();

  fireEvent.mouseEnter(row);
  expect(container.querySelectorAll('.hover-preview img')).toHaveLength(1);
  expect(container.querySelector('.hover-preview img')).toHaveAttribute('src', apps[0].icon);
  expect(addTicker).toHaveBeenCalledTimes(1);
  fireEvent.mouseLeave(row);
  expect(container.querySelector('.hover-preview')).toBeNull();
  expect(dispose).toHaveBeenCalledTimes(1);

  fireEvent.mouseEnter(row);
  fireEvent.scroll(window);
  expect(container.querySelector('.hover-preview')).toBeNull();
  expect(dispose).toHaveBeenCalledTimes(2);
});

test('reduced motion avoids loading a 3D experience and keeps project previews still', () => {
  prefersReducedMotion.mockReturnValue(true);
  const { container } = visit();
  expect(supportsWebGL).not.toHaveBeenCalled();
  expect(container.querySelector('.work-hero__canvas')).toBeNull();
  fireEvent.mouseEnter(container.querySelector('.index-row'));
  expect(container.querySelector('.hover-preview img')).not.toBeNull();
  expect(addTicker).not.toHaveBeenCalled();
});

test('keyboard previews do not follow the pointer and clear when switching categories', () => {
  const { container } = visit();
  fireEvent.focus(container.querySelector('.index-row'));
  expect(container.querySelector('.hover-preview img')).not.toBeNull();
  expect(addTicker).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: /Earlier/ }));
  expect(container.querySelector('.hover-preview')).toBeNull();
  expect(screen.getByRole('status')).toHaveTextContent('1 project');
});
