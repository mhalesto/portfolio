import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteShell from '../../site/components/SiteShell';
import SplitText from '../../site/components/SplitText';
import useReveal from '../../site/useReveal';
import { addTicker } from '../../site/ticker';
import { hasFinePointer, prefersReducedMotion, supportsWebGL } from '../../site/motion';
import { apps, otherProjects, person, webProjects } from '../../site/data';
import './projects.css';

const pad = value => String(value).padStart(2, '0');

const items = [
  ...apps.map(app => ({
    key: app.slug,
    name: app.name,
    kind: app.category,
    platform: app.meta[0],
    to: app.route,
    image: app.icon,
    color: app.colors.a,
    group: 'ios',
    square: true,
  })),
  ...webProjects.map(project => ({
    key: project.slug,
    name: project.name,
    kind: project.kind,
    platform: project.domain,
    href: project.url,
    image: project.image,
    color: project.color,
    group: 'web',
  })),
  ...otherProjects.map(project => ({
    key: project.slug,
    name: project.name,
    kind: project.kind,
    platform: project.platforms,
    to: project.route,
    image: project.image,
    color: project.color,
    group: 'earlier',
  })),
];

const filters = [
  { id: 'all', label: 'All' },
  { id: 'ios', label: 'iOS apps' },
  { id: 'web', label: 'Websites' },
  { id: 'earlier', label: 'Earlier' },
];

// Floating preview that trails the cursor over the index (desktop only).
function HoverPreview({ item }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !hasFinePointer()) return undefined;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let tilt = 0;
    const onMove = event => {
      targetX = event.clientX;
      targetY = event.clientY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    const removeTicker = addTicker((time, delta) => {
      const k = 1 - Math.exp(-delta * (prefersReducedMotion() ? 40 : 9));
      const dx = targetX - x;
      x += dx * k;
      y += (targetY - y) * k;
      tilt += (Math.max(-12, Math.min(12, dx * 0.06)) - tilt) * k;
      element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${tilt.toFixed(2)}deg)`;
    }, 12);
    return () => {
      window.removeEventListener('pointermove', onMove);
      removeTicker();
    };
  }, []);

  return (
    <div className={`hover-preview${item ? ' is-visible' : ''}`} ref={ref} aria-hidden="true">
      <div
        className={`hover-preview__frame${item && item.square ? ' is-square' : ''}`}
        style={item ? { '--preview-color': item.color } : undefined}
      >
        {items.map(entry => (
          <img
            key={entry.key}
            src={entry.image}
            alt=""
            className={item && item.key === entry.key ? 'is-current' : ''}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

function Row({ item, index, onHover }) {
  const content = (
    <>
      <span className="index-row__num mono">{pad(index + 1)}</span>
      <span className="index-row__name">{item.name}</span>
      <span className="index-row__kind">{item.kind}</span>
      <span className="index-row__platform mono">{item.platform}</span>
      <span className="index-row__arrow" aria-hidden="true">
        {item.href ? '↗' : '→'}
      </span>
      <img className="index-row__thumb" src={item.image} alt="" loading="lazy" />
    </>
  );
  const shared = {
    className: `index-row${item.square ? ' index-row--app' : ''}`,
    style: { '--row-color': item.color },
    onMouseEnter: () => onHover(item),
    onMouseLeave: () => onHover(null),
    onFocus: () => onHover(item),
    onBlur: () => onHover(null),
    'data-cursor': item.href ? 'Visit' : 'Open',
  };
  return (
    <li className="index-list__item" data-reveal style={{ '--delay': `${Math.min(index, 8) * 0.04}s` }}>
      {item.href ? (
        <a href={item.href} target="_blank" rel="noreferrer" {...shared}>
          {content}
        </a>
      ) : (
        <Link to={item.to} {...shared}>
          {content}
        </Link>
      )}
    </li>
  );
}

export default function Projects() {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const pageRef = useRef(null);
  const canvasRef = useRef(null);
  const [filter, setFilter] = useState('all');
  const [hovered, setHovered] = useState(null);
  const [heroIn, setHeroIn] = useState(false);
  const [webgl] = useState(() => supportsWebGL());

  const visible = useMemo(() => items.filter(item => filter === 'all' || item.group === filter), [filter]);
  useReveal(pageRef, [filter]);

  useEffect(() => {
    document.title = `Projects — ${person.name}`;
    const id = requestAnimationFrame(() => setHeroIn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!webgl) return undefined;
    let controller = null;
    let cancelled = false;
    import('../../experience/orbit')
      .then(({ createOrbitExperience }) => {
        if (cancelled) return;
        controller = createOrbitExperience({
          canvas: canvasRef.current,
          apps,
          onNavigate: route => navigateRef.current(route),
          onReady: () => canvasRef.current && canvasRef.current.classList.add('is-ready'),
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (controller) controller.dispose();
    };
  }, [webgl]);

  const counts = useMemo(() => {
    const result = { all: items.length };
    items.forEach(item => {
      result[item.group] = (result[item.group] || 0) + 1;
    });
    return result;
  }, []);

  return (
    <SiteShell className="projects-page">
      <main id="main" ref={pageRef}>
        <section className="work-hero" data-in={heroIn ? '' : undefined}>
          {webgl && <canvas ref={canvasRef} className="work-hero__canvas" aria-hidden="true" />}
          <div className="work-hero__content">
            <p className="eyebrow">Index · {pad(items.length)} projects</p>
            <h1 className="work-hero__title">
              <SplitText text="Selected" mode="chars" className="work-hero__line" />{' '}
              <SplitText text="work." mode="chars" className="work-hero__line serif" />
            </h1>
            <p className="work-hero__lede">
              {apps.length} iOS apps, {webProjects.length} client websites and the projects that came before them.
              {webgl ? ' Every icon in the orbit opens its app.' : ''}
            </p>
          </div>
        </section>

        <section className="work-index" aria-labelledby="work-index-title">
          <div className="work-index__head">
            <h2 className="work-index__title" id="work-index-title">
              All projects
            </h2>
            <div className="filters" role="group" aria-label="Filter projects">
              {filters.map(option => (
                <button
                  key={option.id}
                  type="button"
                  className={`filter${filter === option.id ? ' is-active' : ''}`}
                  aria-pressed={filter === option.id}
                  onClick={() => setFilter(option.id)}
                >
                  {option.label}
                  <sup>{counts[option.id] || 0}</sup>
                </button>
              ))}
            </div>
          </div>

          <ul className="index-list" key={filter}>
            {visible.map((item, index) => (
              <Row key={item.key} item={item} index={index} onHover={setHovered} />
            ))}
          </ul>
        </section>
      </main>
      <HoverPreview item={hovered} />
    </SiteShell>
  );
}
