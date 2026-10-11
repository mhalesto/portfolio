import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './index';
import { supportsWebGL } from '../../site/motion';
import { scrollToTarget } from '../../site/scroll';
import { createHomeExperience } from '../../experience/home';

jest.mock('../../site/motion', () => ({
  supportsWebGL: jest.fn(() => false),
  prefersReducedMotion: () => false,
  hasFinePointer: () => false,
}));
jest.mock('../../site/scroll', () => ({
  scrollToTarget: jest.fn(), resetScroll: jest.fn(), startSmoothScroll: jest.fn(), stopSmoothScroll: jest.fn(), setScrollLocked: jest.fn(),
}));
jest.mock('../../site/components/Preloader', () => () => null);
jest.mock('../../experience/home', () => ({
  createHomeExperience: jest.fn(() => ({ dispose: jest.fn(), setYourApp: jest.fn() })),
}));

beforeEach(() => jest.clearAllMocks());

test('static chapter jumps keep headings in view instead of applying cinematic offsets', () => {
  supportsWebGL.mockReturnValue(false);
  render(<MemoryRouter><Home /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Go to Websites (10 of 12)' }));
  expect(scrollToTarget).toHaveBeenLastCalledWith('#web', { offset: 0 });
  fireEvent.click(screen.getByRole('button', { name: 'Go to Contact (12 of 12)' }));
  expect(scrollToTarget).toHaveBeenLastCalledWith('#contact-cta', { offset: 0 });
});

test('selecting an app in the 3D phone passes a numeric scroll destination offset', async () => {
  supportsWebGL.mockReturnValue(true);
  render(<MemoryRouter><Home /></MemoryRouter>);
  await waitFor(() => expect(createHomeExperience).toHaveBeenCalled());
  createHomeExperience.mock.calls[0][0].onSelectApp(0);
  expect(scrollToTarget).toHaveBeenLastCalledWith('#app-clipaura', { offset: window.innerHeight * 0.35 });
});


test('portrait chapter jumps show the world above its copy', async () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  window.innerWidth = 390;
  window.innerHeight = 844;
  supportsWebGL.mockReturnValue(true);
  try {
    render(<MemoryRouter><Home /></MemoryRouter>);
    await waitFor(() => expect(createHomeExperience).toHaveBeenCalled());
    createHomeExperience.mock.calls[0][0].onSelectApp(3);
    expect(scrollToTarget).toHaveBeenLastCalledWith('#app-sugarshifts', { offset: 0 });
    fireEvent.click(screen.getByRole('button', { name: 'Go to SugarShifts (6 of 12)' }));
    expect(scrollToTarget).toHaveBeenLastCalledWith('#app-sugarshifts', { offset: 0 });
  } finally {
    window.innerWidth = width;
    window.innerHeight = height;
  }
});
