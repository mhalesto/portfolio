import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the ResumeStudio project page', () => {
  window.scroll = jest.fn();
  window.history.pushState({}, '', '/projects/resumestudio-ios');
  render(<App />);
  expect(screen.getByRole('heading', { name: /whole job search/i })).toBeInTheDocument();
});
