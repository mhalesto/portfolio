import { useRef } from 'react';
import { Link } from 'react-router-dom';
import LocalTime from './LocalTime';
import useFitText from '../useFitText';
import { portfolioApps as apps, person, webProjects } from '../data';

export default function Footer() {
  const year = new Date().getFullYear();
  const wordRef = useRef(null);
  // The wordmark runs edge to edge whatever the name, font or window width.
  useFitText(wordRef, { min: 56, max: 640, trim: 0.029 });

  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div className="site-footer__cta">
          <p className="eyebrow">Have an app or a website in mind?</p>
          <a className="site-footer__email" href={`mailto:${person.email}`} data-cursor="Write">
            {person.email}
          </a>
        </div>

        <div className="site-footer__cols">
          <div>
            <h2 className="site-footer__title">Apps</h2>
            <ul>
              {apps.map(app => (
                <li key={app.slug}>
                  <Link to={app.route}>{app.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="site-footer__title">Websites</h2>
            <ul>
              {webProjects.map(project => (
                <li key={project.slug}>
                  <a href={project.url} target="_blank" rel="noreferrer">
                    {project.name} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="site-footer__title">Studio</h2>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/projects">Projects</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <a href={person.github} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="site-footer__word" aria-hidden="true">
        <span ref={wordRef}>{person.firstName}</span>
      </div>

      <div className="site-footer__bar">
        <span>
          © {year} {person.studio}
        </span>
        <span>Designed &amp; developed by {person.name}</span>
        <span>
          {person.country} · <LocalTime />
        </span>
      </div>
    </footer>
  );
}
