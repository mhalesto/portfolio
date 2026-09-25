import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteShell from '../../site/components/SiteShell';
import Preloader from '../../site/components/Preloader';
import SplitText from '../../site/components/SplitText';
import Magnetic from '../../site/components/Magnetic';
import Marquee from '../../site/components/Marquee';
import ChapterRail from '../../site/components/ChapterRail';
import YourAppDialog from '../../site/components/YourAppDialog';
import useReveal from '../../site/useReveal';
import { addTicker, loadStore } from '../../site/ticker';
import { scrollToTarget } from '../../site/scroll';
import { prefersReducedMotion, supportsWebGL } from '../../site/motion';
import { apps, person, stack, webProjects } from '../../site/data';
import { buildMailto, loadYourApp, saveYourApp, yourAppIconUrl } from '../../site/yourApp';
import './home.css';

const pad = value => String(value).padStart(2, '0');
const REEL_URL = `${process.env.PUBLIC_URL}/experience/clipaura-reel.webp`;
const MANIFESTO =
  'I build apps end to end: the interface, the code, the payments, the privacy policy and the support page. Seven of them live on this phone. Keep scrolling and each one opens into a world of its own.';

// What to tell a visitor who just saved their app, depending on where they are.
function savedMessage(app, webgl) {
  const finale = document.getElementById('contact-cta');
  const atFinale = finale && finale.getBoundingClientRect().top < window.innerHeight * 0.6;
  if (atFinale) return webgl ? `${app.name} just joined the orbit.` : `${app.name} is saved.`;
  return webgl
    ? `${app.name} is on the phone. Scroll to the end to watch it join the orbit.`
    : `${app.name} is saved. Send it to me from the end of the page.`;
}

// The preloader only plays on the first visit of a session.
let introPlayed = false;

function Manifesto() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const words = Array.from(section.querySelectorAll('.manifesto__word'));
    if (prefersReducedMotion()) {
      words.forEach(word => {
        word.style.opacity = 1;
      });
      return undefined;
    }
    let last = -1;
    return addTicker(() => {
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(travel, 1)));
      if (Math.abs(progress - last) < 0.001) return;
      last = progress;
      const lit = progress * (words.length + 6) - 3;
      words.forEach((word, index) => {
        const amount = Math.min(1, Math.max(0, lit - index + 1));
        word.style.opacity = (0.14 + amount * 0.86).toFixed(3);
      });
    }, 15);
  }, []);

  return (
    <section className="manifesto" id="manifesto" ref={sectionRef} aria-label="Introduction">
      <div className="manifesto__sticky">
        <p className="manifesto__text">
          {MANIFESTO.split(' ').map((word, index) => (
            <span key={`${word}-${index}`} className={`manifesto__word${/phone|world/.test(word) ? ' serif' : ''}`}>
              {word}{' '}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

function AppChapter({ app, index, total, webgl }) {
  return (
    <section
      id={`app-${app.slug}`}
      className="chapter"
      data-station={index + 1}
      data-hold="0.7"
      aria-labelledby={`app-${app.slug}-title`}
      style={{ '--app-a': app.colors.a, '--app-b': app.colors.b }}
    >
      <div className="chapter__sticky">
        <div className="chapter__panel" data-reveal>
          <div className="chapter__top">
            <span className="chapter__index">
              {pad(index + 1)} <i>/</i> {pad(total)}
            </span>
            <span className="eyebrow">{app.category}</span>
          </div>
          <h2 className="chapter__name" id={`app-${app.slug}-title`} style={{ '--chars': app.name.length }}>
            <SplitText text={app.name} mode="chars" />
          </h2>
          <p className="chapter__tagline">{app.tagline}</p>
          <p className="chapter__summary">{app.summary}</p>
          <ul className="chapter__features">
            {app.features.map((feature, featureIndex) => (
              <li key={feature}>
                <span className="mono">{pad(featureIndex + 1)}</span>
                {feature}
              </li>
            ))}
          </ul>
          <div className="chapter__meta">
            {app.meta.map(item => (
              <span className="chip" key={item}>
                {item}
              </span>
            ))}
          </div>
          <div className="chapter__actions">
            <Magnetic>
              <Link to={app.route} className="btn btn--primary" style={{ '--btn-accent': app.colors.a }}>
                Explore {app.name}
                <span className="btn__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </Magnetic>
            <nav className="chapter__links" aria-label={`${app.name} policies and support`}>
              {app.links.map(link => (
                <Link key={link.to} to={link.to} className="text-link">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        {webgl ? (
          <p className="chapter__hint" aria-hidden="true">
            <span className="chapter__hint-dot" />
            {app.hint}
          </p>
        ) : (
          <img className="chapter__fallback" src={app.icon} alt="" loading="lazy" />
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const mainRef = useRef(null);
  const canvasRef = useRef(null);
  const experienceRef = useRef(null);
  const [webgl] = useState(() => supportsWebGL());
  const [preloading, setPreloading] = useState(() => !introPlayed && webgl && !prefersReducedMotion());
  const [heroIn, setHeroIn] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [yourApp, setYourApp] = useState(() => loadYourApp());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const yourAppRef = useRef(yourApp);
  yourAppRef.current = yourApp;

  useReveal(mainRef);

  useEffect(() => {
    document.title = `${person.name} — iOS apps & websites`;
  }, []);

  useEffect(() => {
    if (!webgl) {
      loadStore.set({ progress: 1, ready: true });
      return undefined;
    }
    loadStore.set({ progress: 0, ready: false });
    let controller = null;
    let cancelled = false;
    const fail = () => {
      setSceneFailed(true);
      loadStore.set({ progress: 1, ready: true });
    };
    import('../../experience/home')
      .then(({ createHomeExperience }) => {
        if (cancelled) return;
        controller = createHomeExperience({
          canvas: canvasRef.current,
          root: mainRef.current,
          apps,
          webProjects,
          reelUrl: REEL_URL,
          onProgress: value => loadStore.set({ progress: value }),
          onReady: () => {
            loadStore.set({ progress: 1, ready: true });
            if (canvasRef.current) canvasRef.current.classList.add('is-ready');
          },
          onNavigate: route => navigateRef.current(route),
          onSelectApp: index =>
            scrollToTarget(`#app-${apps[index].slug}`, {
              offset: window.innerHeight * 0.35,
            }),
          onYourApp: () => setDialogOpen(true),
          onBuildYourApp: () => {
            if (yourAppRef.current) window.location.href = buildMailto(yourAppRef.current);
          },
          onError: fail,
        });
        controller.setYourApp(yourAppRef.current);
        experienceRef.current = controller;
      })
      .catch(fail);
    return () => {
      cancelled = true;
      if (controller) controller.dispose();
      experienceRef.current = null;
    };
  }, [webgl]);

  useEffect(() => {
    if (preloading) return undefined;
    const id = requestAnimationFrame(() => setHeroIn(true));
    return () => cancelAnimationFrame(id);
  }, [preloading]);

  const railItems = useMemo(
    () => [
      { id: 'top', label: 'Intro' },
      ...apps.map(app => ({
        id: `app-${app.slug}`,
        label: app.name,
        color: app.colors.a,
        offset: window.innerHeight * 0.35,
      })),
      { id: 'web', label: 'Websites', offset: window.innerHeight * 0.3 },
      { id: 'about', label: 'About' },
      {
        id: 'contact-cta',
        label: 'Contact',
        offset: window.innerHeight * 0.25,
      },
    ],
    [],
  );

  const setWebHover = index => {
    if (experienceRef.current) experienceRef.current.setWebHover(index);
  };

  useEffect(() => {
    if (experienceRef.current) experienceRef.current.setYourApp(yourApp);
  }, [yourApp]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(null), 5200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const yourIcon = useMemo(() => yourAppIconUrl(yourApp, 168), [yourApp]);

  const changeYourApp = (app, message) => {
    saveYourApp(app);
    setYourApp(app);
    setDialogOpen(false);
    setToast({ id: Date.now(), message });
  };

  const webglActive = webgl && !sceneFailed;

  return (
    <SiteShell className={`home${webglActive ? '' : ' home--static'}`}>
      {preloading && (
        <Preloader
          onLeave={() => setHeroIn(true)}
          onDone={() => {
            introPlayed = true;
            setPreloading(false);
          }}
        />
      )}
      {webgl && <canvas ref={canvasRef} className="home-canvas" aria-hidden="true" />}
      <ChapterRail items={railItems} />

      <main id="main" className="home-main" ref={mainRef}>
        <section className="hero" id="top" data-station="0" data-hold="0.85" data-in={heroIn ? '' : undefined}>
          <div className="hero__sticky">
            <div className="hero__top">
              <p className="eyebrow">Full-stack developer · Founder of {person.studio}</p>
              <p className="hero__meta mono">
                Portfolio <span>’{String(new Date().getFullYear()).slice(2)}</span>
              </p>
            </div>

            <h1 className="hero__title">
              <SplitText text={person.firstName} mode="chars" className="hero__line" />{' '}
              <SplitText text={person.lastName} mode="chars" className="hero__line hero__line--serif" />
            </h1>

            <div className="hero__bottom">
              <div className="hero__intro">
                <p className="hero__lede">
                  I build iOS apps and websites from {person.country}. Seven of my apps live on this phone, and each one
                  opens into a world of its own.
                </p>
                <button
                  type="button"
                  className={`hero__yours${yourApp ? ' has-app' : ''}`}
                  data-cursor={yourApp ? 'Edit' : 'Add yours'}
                  onClick={() => setDialogOpen(true)}
                >
                  {yourApp && yourIcon ? (
                    <img src={yourIcon} alt="" />
                  ) : (
                    <span className="hero__yours-plus" aria-hidden="true">
                      +
                    </span>
                  )}
                  {yourApp ? (
                    <span>
                      <b>{yourApp.name}</b> is in the last slot · Edit
                    </span>
                  ) : (
                    <span>
                      There’s room for one more. <b>Put your app idea {webglActive ? 'on this phone' : 'here'}</b>
                    </span>
                  )}
                </button>
              </div>
              <div className="hero__actions">
                <Magnetic>
                  <button type="button" className="btn btn--primary" onClick={() => scrollToTarget('#manifesto')}>
                    Start the journey
                    <span className="btn__arrow btn__arrow--down" aria-hidden="true">
                      ↓
                    </span>
                  </button>
                </Magnetic>
                <Magnetic>
                  <Link to="/contact" className="btn">
                    Get in touch
                  </Link>
                </Magnetic>
              </div>
            </div>

            {!webglActive && (
              <ul className="hero__fallback" aria-label="Apps">
                {apps.map(app => (
                  <li key={app.slug}>
                    <a
                      href={`#app-${app.slug}`}
                      onClick={event => {
                        event.preventDefault();
                        scrollToTarget(`#app-${app.slug}`);
                      }}
                    >
                      <img src={app.icon} alt="" />
                      <span>{app.name}</span>
                    </a>
                  </li>
                ))}
                <li>
                  <button type="button" className="hero__fallback-yours" onClick={() => setDialogOpen(true)}>
                    {yourApp && yourIcon ? <img src={yourIcon} alt="" /> : <i aria-hidden="true">+</i>}
                    <span>{yourApp ? yourApp.name : 'Your app'}</span>
                  </button>
                </li>
              </ul>
            )}

            <p className="hero__cue mono" aria-hidden="true">
              <span>{webglActive ? 'Scroll to launch the apps' : 'Scroll'}</span>
              <i />
            </p>
          </div>
        </section>

        <Manifesto />

        {apps.map((app, index) => (
          <AppChapter key={app.slug} app={app} index={index} total={apps.length} webgl={webglActive} />
        ))}

        <section className="web" id="web" data-station={apps.length + 1} data-hold="0.7" aria-labelledby="web-title">
          <div className="web__sticky">
            <div className="web__panel" data-reveal>
              <p className="eyebrow">Websites</p>
              <h2 className="web__title" id="web-title">
                Websites for businesses, schools <span className="serif">and practices.</span>
              </h2>
              <ul className="web__list">
                {webProjects.map((project, index) => (
                  <li key={project.slug}>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="web__row"
                      data-cursor="Visit"
                      style={{ '--row-color': project.color }}
                      onMouseEnter={() => setWebHover(index)}
                      onMouseLeave={() => setWebHover(-1)}
                      onFocus={() => setWebHover(index)}
                      onBlur={() => setWebHover(-1)}
                    >
                      <span className="web__num mono">{pad(index + 1)}</span>
                      <span className="web__name">{project.name}</span>
                      <span className="web__kind">{project.kind}</span>
                      <span className="web__domain mono">
                        {project.domain}
                        <span aria-hidden="true"> ↗</span>
                      </span>
                      {!webglActive && <img className="web__thumb" src={project.image} alt="" loading="lazy" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="about" id="about" aria-labelledby="about-title">
          <div className="about__intro">
            <p className="eyebrow" data-reveal>
              About
            </p>
            <h2 className="about__title" id="about-title" data-reveal>
              I’m {person.firstName}, a full-stack developer in {person.country} who builds{' '}
              <span className="serif">products end to end.</span>
            </h2>
            <dl className="about__stats" data-reveal>
              <div>
                <dt>iOS apps</dt>
                <dd>{pad(apps.length)}</dd>
              </div>
              <div>
                <dt>Websites</dt>
                <dd>{pad(webProjects.length)}</dd>
              </div>
              <div>
                <dt>Studio · {person.studio}</dt>
                <dd>01</dd>
              </div>
            </dl>
          </div>
          <div className="about__body">
            <p className="about__lede" data-reveal>
              Under {person.studio} I build and support iOS apps all the way through: the interface, the code, StoreKit
              payments, the privacy policy and the support page. On the web I build storefronts, school and practice
              sites and management platforms with React, Node and the rest of the JavaScript stack.
            </p>
            <div className="about__stack">
              {stack.map((group, index) => (
                <div className="stack-group" key={group.group} data-reveal style={{ '--delay': `${index * 0.08}s` }}>
                  <p className="mono">{group.group}</p>
                  <ul>
                    {group.items.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <pre className="about__code" data-reveal aria-label="About me as JSON">
              <code>
                <span className="tok-p">{'{'}</span>
                {'\n  '}
                <span className="tok-k">"name"</span>: <span className="tok-s">"{person.name}"</span>,{'\n  '}
                <span className="tok-k">"role"</span>: <span className="tok-s">"{person.role}"</span>,{'\n  '}
                <span className="tok-k">"studio"</span>: <span className="tok-s">"{person.studio}"</span>,{'\n  '}
                <span className="tok-k">"country"</span>: <span className="tok-s">"{person.country}"</span>,{'\n  '}
                <span className="tok-k">"apps"</span>: <span className="tok-n">{apps.length}</span>,{'\n  '}
                <span className="tok-k">"websites"</span>: <span className="tok-n">{webProjects.length}</span>
                {'\n'}
                <span className="tok-p">{'}'}</span>
              </code>
            </pre>
          </div>
        </section>

        <Marquee items={['iOS apps', 'Websites', 'Full-stack', person.studio, person.country]} />

        <section
          className="finale"
          id="contact-cta"
          data-station={apps.length + 2}
          data-hold="0.6"
          aria-labelledby="finale-title"
        >
          <div className="finale__sticky">
            <div className="finale__content" data-reveal>
              <p className="eyebrow eyebrow--plain">Next up</p>
              <h2 className="finale__title" id="finale-title">
                <SplitText text="Let’s build" />{' '}
                {yourApp ? (
                  <SplitText
                    key={yourApp.name}
                    text={`${yourApp.name}.`}
                    className="serif finale__name"
                    style={{ '--len': yourApp.name.length + 1 }}
                  />
                ) : (
                  <SplitText text="what’s next." className="serif" />
                )}
              </h2>
              <div className="finale__actions">
                <Magnetic>
                  {yourApp ? (
                    <a href={buildMailto(yourApp)} className="btn btn--primary" data-cursor="Write">
                      Email me about {yourApp.name}
                      <span className="btn__arrow" aria-hidden="true">
                        →
                      </span>
                    </a>
                  ) : (
                    <a href={`mailto:${person.email}`} className="btn btn--primary" data-cursor="Write">
                      {person.email}
                      <span className="btn__arrow" aria-hidden="true">
                        →
                      </span>
                    </a>
                  )}
                </Magnetic>
                <Magnetic>
                  <Link to="/projects" className="btn">
                    All projects
                  </Link>
                </Magnetic>
              </div>
              <p className="finale__hint">
                {webglActive &&
                  (yourApp
                    ? 'Every icon in orbit opens its app. Yours emails me. '
                    : 'Every icon in orbit opens its app. ')}
                <button type="button" className="text-link finale__yours" onClick={() => setDialogOpen(true)}>
                  {yourApp ? `Edit ${yourApp.name}` : 'Add your own app idea'}
                </button>
              </p>
            </div>
          </div>
        </section>
      </main>

      <YourAppDialog
        open={dialogOpen}
        initial={yourApp}
        scene={webglActive}
        onClose={() => setDialogOpen(false)}
        onSave={app => changeYourApp(app, savedMessage(app, webglActive))}
        onRemove={() => changeYourApp(null, 'Your app idea is removed.')}
      />
      <div className="yourapp-toasts" role="status" aria-live="polite">
        {toast && (
          <p className="yourapp-toast" key={toast.id}>
            {toast.message}
          </p>
        )}
      </div>
    </SiteShell>
  );
}
