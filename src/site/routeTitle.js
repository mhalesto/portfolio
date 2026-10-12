import { apps, otherProjects } from './data';

const SECTIONS = {
  privacy: 'Privacy Policy',
  'data-collection': 'Data Collection',
  support: 'Support',
  terms: 'Terms of Use',
};

// Tab titles for the product and policy pages, in the same form as their
// static copies in public/projects ("ClipAura Privacy Policy").
export function titleForPath(pathname) {
  const path = pathname.replace(/\/+$/, '');
  const project = [...apps, ...otherProjects].find(item => path === item.route || path.startsWith(`${item.route}/`));
  if (!project) return null;
  if (path === project.route) return `${project.name} — ${project.tagline || project.kind}`;
  const section = SECTIONS[path.slice(project.route.length + 1)];
  return section ? `${project.name} ${section}` : project.name;
}
