import { render, screen } from '@testing-library/react';
import App from './App';
import { apps, otherProjects, person, webProjects } from './site/data';

jest.mock('lenis', () => ({
  __esModule: true,
  default: class Lenis {
    on() {}
    raf() {}
    stop() {}
    start() {}
    scrollTo() {}
    destroy() {}
  },
}));

// Every product, policy and support URL that existed before the redesign.
// App Store listings link to these, so they must keep rendering.
const legacyRoutes = [
  '/projects/soundframe-studio',
  '/projects/soundframe-studio/privacy',
  '/projects/soundframe-studio/data-collection',
  '/projects/soundframe-ios',
  '/projects/soundframe-ios/privacy',
  '/projects/soundframe-ios/data-collection',
  '/projects/lifetrack-ios',
  '/projects/lifetrack-ios/privacy',
  '/projects/lifetrack-ios/data-collection',
  '/projects/youmine-ios',
  '/projects/youmine-ios/privacy',
  '/projects/youmine-ios/data-collection',
  '/projects/sugarshifts-ios',
  '/projects/sugarshifts-ios/privacy',
  '/projects/sugarshifts-ios/data-collection',
  '/projects/resumestudio-ios',
  '/projects/resumestudio-ios/privacy',
  '/projects/resumestudio-ios/data-collection',
  '/projects/resumestudio-ios/support',
  '/projects/smartcleaner-ios',
  '/projects/smartcleaner-ios/privacy',
  '/projects/smartcleaner-ios/data-collection',
  '/projects/smartcleaner-ios/support',
  '/projects/clipaura-ios',
  '/projects/clipaura-ios/privacy',
  '/projects/clipaura-ios/data-collection',
  '/projects/clipaura-ios/support',
  '/projects/clipaura-ios/terms',
];

const visit = route => {
  window.history.pushState({}, '', route);
  return render(<App />);
};

beforeEach(() => {
  window.scroll = jest.fn();
  window.scrollTo = jest.fn();
  // jsdom has no WebGL; the pages must fall back to plain DOM content.
  HTMLCanvasElement.prototype.getContext = jest.fn(() => null);
});

test('renders the ResumeStudio project page', () => {
  visit('/projects/resumestudio-ios');
  expect(screen.getByRole('heading', { name: /whole job search/i })).toBeInTheDocument();
});

test.each(legacyRoutes)('%s still renders inside the site layout', route => {
  const { container } = visit(route);
  expect(container.querySelector('.legacy')).not.toBeNull();
  expect(screen.getAllByRole('heading').length).toBeGreaterThan(0);
});

test('home introduces Halalisani and gives every app a chapter linked to its pages', () => {
  visit('/');
  expect(screen.getByRole('heading', { level: 1, name: person.name })).toBeInTheDocument();
  apps.forEach(app => {
    expect(screen.getByRole('heading', { level: 2, name: app.name })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: `Explore ${app.name}` })).toHaveAttribute('href', app.route);
    app.links.forEach(link => {
      expect(document.querySelector(`#app-${app.slug} a[href="${link.to}"]`)).not.toBeNull();
    });
  });
  webProjects.forEach(project => {
    expect(document.querySelector(`.web__row[href="${project.url}"]`)).not.toBeNull();
  });
});

test('projects lists every app, website and earlier project', () => {
  visit('/projects');
  [...apps, ...webProjects, ...otherProjects].forEach(project => {
    expect(screen.getByText(project.name, { selector: '.index-row__name' })).toBeInTheDocument();
  });
});

test('contact keeps the support instructions and email', () => {
  visit('/contact');
  expect(screen.getByRole('heading', { name: 'Contact CurrentTech' })).toBeInTheDocument();
  expect(screen.getByText(/include the app name, device model, iOS version/i)).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: person.email })[0]).toHaveAttribute('href', `mailto:${person.email}`);
});
