import { useEffect, useState } from 'react';
import { scrollToTarget } from '../scroll';

// Desktop wayfinding and a native chapter picker for touch screens share the
// same destinations. Observe a real band of the viewport, not a zero-height line.
export default function ChapterRail({ items }) {
  const [active, setActive] = useState(items[0] ? items[0].id : '');
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const elements = items.map(item => document.getElementById(item.id)).filter(Boolean);
    let observer;
    const measure = () => {
      if (observer) observer.disconnect();
      const margin = Math.round(window.innerHeight * 0.42);
      observer = new IntersectionObserver(() => {
        const middle = window.innerHeight / 2;
        const current = elements.find(element => {
          const rect = element.getBoundingClientRect();
          return rect.top <= middle && rect.bottom >= middle;
        });
        if (current) setActive(current.id);
      }, { rootMargin: `-${margin}px 0px -${margin}px 0px`, threshold: 0 });
      elements.forEach(element => observer.observe(element));
    };
    measure();
    window.addEventListener('resize', measure);
    const footer = document.querySelector('.site-footer');
    const footerObserver = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { threshold: 0.2 });
    if (footer) footerObserver.observe(footer);
    return () => {
      observer.disconnect();
      footerObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [items]);

  const travel = id => {
    const item = items.find(entry => entry.id === id);
    if (!item) return;
    setActive(id);
    const offset = typeof item.offset === 'function' ? item.offset() : item.offset || 0;
    scrollToTarget(`#${id}`, { offset });
  };

  return (
    <>
      <nav className={`rail${hidden ? ' is-hidden' : ''}`} aria-label="Sections" {...(hidden ? { inert: '' } : {})}>
        <ol>
          {items.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                className={`rail__item${active === item.id ? ' is-active' : ''}`}
                aria-current={active === item.id ? 'location' : undefined}
                onClick={() => travel(item.id)}
                style={item.color ? { '--rail-color': item.color } : undefined}
              >
                <span className="rail__label" aria-hidden="true">{item.label}</span>
                <span className="rail__tick" aria-hidden="true" />
                <span className="sr-only">{`Go to ${item.label} (${index + 1} of ${items.length})`}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <div className={`chapter-jump${hidden || active === 'top' ? ' is-hidden' : ''}`} {...(hidden || active === 'top' ? { inert: '' } : {})}>
        <label htmlFor="chapter-select" className="mono">Explore</label>
        <select id="chapter-select" aria-label="Jump to a section" value={active} onChange={event => travel(event.target.value)}>
          {items.map((item, index) => <option key={item.id} value={item.id}>{String(index + 1).padStart(2, '0')} · {item.label}</option>)}
        </select>
      </div>
    </>
  );
}
