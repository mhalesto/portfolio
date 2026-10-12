import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteShell from '../../site/components/SiteShell';
import SplitText from '../../site/components/SplitText';
import useReveal from '../../site/useReveal';
import { addTicker } from '../../site/ticker';
import { scrollToTarget } from '../../site/scroll';
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

// Keep previews in the right-hand metadata columns so the project name stays
// readable. Only the active image and its movement subscription are mounted.
function HoverPreview({ item, anchor, followPointer }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !anchor || !hasFinePointer() || window.innerWidth <= 900) return undefined;
    const bounds = anchor.getBoundingClientRect();
    const name = anchor.querySelector('.index-row__name').getBoundingClientRect();
    const size = Math.min(260, window.innerWidth - name.right - 48, window.innerHeight - 130);
    if (size < 150) return undefined;
    const x = window.innerWidth - size - 24;
    const listTop = anchor.closest('.index-list')?.getBoundingClientRect().top || 0;
    const maxY = window.innerHeight - size - 24;
    const minY = Math.min(maxY, Math.max(90, listTop + 8));
    const clampY = value => Math.max(minY, Math.min(maxY, value));
    let targetY = clampY(bounds.top + bounds.height / 2 - size / 2);
    let y = targetY;
    const draw = () => {
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      element.classList.add('is-positioned');
    };
    draw();
    // Keyboard focus and reduced motion get a still preview beside the row.
    if (!followPointer || prefersReducedMotion()) return undefined;
    const onMove = event => {
      targetY = clampY(event.clientY - size / 2);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    const removeTicker = addTicker((time, delta) => {
      if (Math.abs(targetY - y) < 0.1) return;
      const k = 1 - Math.exp(-delta * 12);
      y += (targetY - y) * k;
      draw();
    }, 12);
    return () => {
      window.removeEventListener('pointermove', onMove);
      removeTicker();
    };
  }, [item.key, anchor, followPointer]);

  return (
    <div className="hover-preview" ref={ref} aria-hidden="true">
      <div
        className={`hover-preview__frame${item.square ? ' is-square' : ''}`}
        style={{ '--preview-color': item.color }}
      >
        <img key={item.key} src={item.image} alt="" width="260" height="260" decoding="async" />
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
      <img className="index-row__thumb" src={item.image} alt="" width="64" height="64" loading="lazy" decoding="async" />
    </>
  );
  const shared = {
    className: `index-row${item.square ? ' index-row--app' : ''}`,
    style: { '--row-color': item.color },
    onMouseEnter: event => {
      if (hasFinePointer() && window.innerWidth > 900) onHover({ item, anchor: event.currentTarget, followPointer: true });
    },
    onMouseLeave: () => onHover(null),
    onFocus: event => {
      if (hasFinePointer() && window.innerWidth > 900) onHover({ item, anchor: event.currentTarget, followPointer: false });
    },
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
  const [webgl] = useState(() => !prefersReducedMotion() && supportsWebGL());

  const visible = useMemo(() => items.filter(item => filter === 'all' || item.group === filter), [filter]);
  useReveal(pageRef, [filter]);

  useEffect(() => {
    if (!hovered) return undefined;
    const dismissPreview = () => setHovered(null);
    window.addEventListener('scroll', dismissPreview, { passive: true });
    window.addEventListener('resize', dismissPreview, { passive: true });
    return () => {
      window.removeEventListener('scroll', dismissPreview);
      window.removeEventListener('resize', dismissPreview);
    };
  }, [hovered]);

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
              {apps.length} iOS apps, {webProjects.length} websites and the projects that came before them.
              {webgl ? ' Every icon in the orbit opens its app.' : ''}
            </p>
            <a
              className="work-hero__browse text-link"
              href="#work-index"
              onClick={event => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                scrollToTarget('#work-index', { offset: -84 });
                document.getElementById('work-index-title')?.focus({ preventScroll: true });
              }}
            >
              Browse projects <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section className="work-index" id="work-index" aria-labelledby="work-index-title">
          <div className="work-index__head">
            <div>
              <h2 className="work-index__title" id="work-index-title" tabIndex="-1">
                {filter === 'all' ? 'All projects' : filters.find(option => option.id === filter).label}
              </h2>
              <p className="work-index__count mono" role="status" aria-live="polite" aria-atomic="true">
                {visible.length} {visible.length === 1 ? 'project' : 'projects'}
              </p>
            </div>
            <div className="filters" role="group" aria-label="Filter projects">
              {filters.map(option => (
                <button
                  key={option.id}
                  type="button"
                  className={`filter${filter === option.id ? ' is-active' : ''}`}
                  aria-pressed={filter === option.id}
                  onClick={() => {
                    setHovered(null);
                    setFilter(option.id);
                  }}
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
      {hovered && <HoverPreview {...hovered} />}
    </SiteShell>
  );
}
