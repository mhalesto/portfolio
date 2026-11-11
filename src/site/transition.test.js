import { internalDestination, samePage, setLeaveHandler, travel } from './transition';

// The visitor is on /projects, so relative and in-page links resolve from there.
beforeEach(() => window.history.pushState({}, '', '/projects'));

function click(html, init = {}) {
  document.body.innerHTML = html;
  const target = document.querySelector('[data-target]') || document.body.firstElementChild;
  let destination;
  const onClick = event => {
    destination = internalDestination(event);
    // jsdom would otherwise try to follow the link.
    event.preventDefault();
  };
  document.addEventListener('click', onClick);
  target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...init }));
  document.removeEventListener('click', onClick);
  return destination;
}

afterEach(() => {
  document.body.innerHTML = '';
});

test('an ordinary click on a link to another page of the site is taken over', () => {
  expect(click('<a href="/contact">Contact</a>')).toBe('/contact');
  expect(click('<a href="/projects/clipaura-ios/privacy?from=home#data">Privacy</a>')).toBe(
    '/projects/clipaura-ios/privacy?from=home#data',
  );
  // A click on something inside the link counts too.
  expect(click('<a href="/"><span data-target>Home</span></a>')).toBe('/');
});

test('clicks that are not a plain move to another page are left to the browser', () => {
  expect(click('<a href="/contact">Contact</a>', { ctrlKey: true })).toBeNull();
  expect(click('<a href="/contact">Contact</a>', { metaKey: true })).toBeNull();
  expect(click('<a href="/contact">Contact</a>', { shiftKey: true })).toBeNull();
  expect(click('<a href="/contact">Contact</a>', { button: 1 })).toBeNull();
  expect(click('<a href="/contact" target="_blank">Contact</a>')).toBeNull();
  expect(click('<a href="/resume.pdf" download>CV</a>')).toBeNull();
  expect(click('<a href="https://promosecret.co.za">PromoSecret</a>')).toBeNull();
  expect(click('<a href="mailto:currenttech.co.za@gmail.com">Email</a>')).toBeNull();
  expect(click('<button type="button">Not a link</button>')).toBeNull();
});

test('files and links within the current page are not page changes', () => {
  expect(click('<a href="/experience/resume-atlas.webp">Open full size</a>')).toBeNull();
  expect(click('<a href="#work-index">Browse projects</a>')).toBeNull();
  expect(click('<a href="/projects/">Projects</a>')).toBeNull();
  expect(samePage('/projects/', '/projects')).toBe(true);
  expect(samePage('/', '')).toBe(true);
  expect(samePage('/projects', '/projects/clipaura-ios')).toBe(false);
});

test('a click something else already handled is not taken over', () => {
  document.body.innerHTML = '<a href="/contact">Contact</a>';
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
  let destination = 'unset';
  const first = e => e.preventDefault();
  const second = e => {
    destination = internalDestination(e);
  };
  document.addEventListener('click', first);
  document.addEventListener('click', second);
  document.querySelector('a').dispatchEvent(event);
  document.removeEventListener('click', first);
  document.removeEventListener('click', second);
  expect(destination).toBeNull();
});

test('travel uses the curtain when one is mounted and can play, and navigates directly otherwise', () => {
  const navigate = jest.fn();
  travel('/contact', navigate);
  expect(navigate).toHaveBeenCalledWith('/contact');

  const accept = jest.fn(() => true);
  const remove = setLeaveHandler(accept);
  travel('/projects', navigate);
  expect(accept).toHaveBeenCalledWith('/projects');
  expect(navigate).toHaveBeenCalledTimes(1);

  // A curtain that cannot play (reduced motion) hands the move straight back.
  setLeaveHandler(() => false);
  travel('/projects', navigate);
  expect(navigate).toHaveBeenLastCalledWith('/projects');

  // Removing an old handler must not unseat the one that replaced it.
  const current = jest.fn(() => true);
  const removeCurrent = setLeaveHandler(current);
  remove();
  travel('/', navigate);
  expect(current).toHaveBeenCalledWith('/');
  removeCurrent();
  travel('/', navigate);
  expect(navigate).toHaveBeenLastCalledWith('/');
});
