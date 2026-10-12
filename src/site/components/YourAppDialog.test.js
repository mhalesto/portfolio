import { fireEvent, render, screen } from '@testing-library/react';
import YourAppDialog from './YourAppDialog';

jest.mock('../scroll', () => ({ setScrollLocked: jest.fn() }));
jest.mock('../yourApp', () => ({
  IDEA_MAX: 180,
  NAME_MAX: 24,
  cleanYourApp: app => app,
  drawYourAppIcon: jest.fn(),
}));

test('keyboard focus stays inside the app idea dialog and returns on close', () => {
  jest.useFakeTimers();
  const trigger = document.createElement('button');
  document.body.appendChild(trigger);
  trigger.focus();
  const { rerender } = render(<YourAppDialog open onClose={() => {}} />);
  jest.runOnlyPendingTimers();
  const name = screen.getByRole('textbox', { name: 'App name' });
  const cancel = screen.getByRole('button', { name: 'Cancel' });
  expect(name).toHaveFocus();
  fireEvent.keyDown(name, { key: 'Tab', shiftKey: true });
  expect(cancel).toHaveFocus();
  fireEvent.keyDown(cancel, { key: 'Tab' });
  expect(name).toHaveFocus();
  rerender(<YourAppDialog open={false} onClose={() => {}} />);
  expect(trigger).toHaveFocus();
  trigger.remove();
  jest.useRealTimers();
});
