import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteShell from '../../site/components/SiteShell';
import SplitText from '../../site/components/SplitText';
import Magnetic from '../../site/components/Magnetic';
import useReveal from '../../site/useReveal';
import { apps, otherProjects, person } from '../../site/data';
import './contact.css';

const Contact = () => {
  const pageRef = useRef(null);
  const [heroIn, setHeroIn] = useState(false);
  const [copied, setCopied] = useState(false);
  useReveal(pageRef);

  useEffect(() => {
    document.title = `Contact — ${person.studio}`;
    const id = requestAnimationFrame(() => setHeroIn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!copied) return undefined;
    const id = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
    } catch (error) {
      window.location.href = `mailto:${person.email}`;
    }
  };

  return (
    <SiteShell className="contact-page">
      <main id="main" ref={pageRef}>
        <section className="contact-hero" data-in={heroIn ? '' : undefined}>
          <div className="contact-hero__orb" aria-hidden="true" />
          <p className="eyebrow">Contact · Support</p>
          <h1 className="contact-hero__title">
            <SplitText text="Say" mode="chars" className="contact-hero__line" />{' '}
            <SplitText text="hello." mode="chars" className="contact-hero__line serif" />
          </h1>
          <p className="contact-hero__lede">
            Project enquiries, app support, privacy questions, subscriptions or feedback: it all reaches the same inbox
            at {person.studio}.
          </p>
          <div className="contact-hero__actions">
            <Magnetic>
              <a className="btn btn--primary contact-hero__email" href={`mailto:${person.email}`} data-cursor="Write">
                {person.email}
                <span className="btn__arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </Magnetic>
            <button type="button" className="btn" onClick={copyEmail} aria-live="polite">
              {copied ? 'Copied ✓' : 'Copy address'}
            </button>
          </div>
        </section>

        <section className="contact-support" aria-labelledby="support-title">
          <div className="contact-support__intro" data-reveal>
            <p className="eyebrow">Support</p>
            <h2 id="support-title">Contact CurrentTech</h2>
            <p>
              For app support, privacy questions, subscription issues, project questions, or feedback, email{' '}
              <a href={`mailto:${person.email}`} className="text-link">
                {person.email}
              </a>
              .
            </p>
            <p>
              Include the app name, device model, iOS version, and a short description of the issue so support can
              respond with the right context.
            </p>
          </div>

          <ul className="support-grid">
            {apps.map((app, index) => (
              <li
                key={app.slug}
                className="support-card"
                data-reveal
                style={{ '--delay': `${index * 0.05}s`, '--card-color': app.colors.a }}
              >
                <Link to={app.route} className="support-card__head">
                  <img src={app.icon} alt="" />
                  <span>
                    <strong>{app.name}</strong>
                    <small>{app.category}</small>
                  </span>
                </Link>
                <nav className="support-card__links" aria-label={`${app.name} policies and support`}>
                  {app.links.map(link => (
                    <Link key={link.to} to={link.to}>
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </li>
            ))}
            {otherProjects.map(project => (
              <li key={project.slug} className="support-card" data-reveal style={{ '--card-color': project.color }}>
                <Link to={project.route} className="support-card__head">
                  <img src={project.image} alt="" />
                  <span>
                    <strong>{project.name}</strong>
                    <small>{project.kind}</small>
                  </span>
                </Link>
                <nav className="support-card__links" aria-label={`${project.name} policies`}>
                  <Link to={`${project.route}/privacy`}>Privacy</Link>
                  <Link to={`${project.route}/data-collection`}>Data</Link>
                </nav>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </SiteShell>
  );
};

export default Contact;
