import { useEffect, useState } from 'react';
import { scrollToTarget } from '../scroll';
import TourIcon from './TourIcon';

// Desktop wayfinding and a native chapter picker for touch screens share the
// same destinations. Observe a real band of the viewport, not a zero-height line.
// Both also carry the tour's play and pause control when a tour is on offer
// (tour: the object from useTour), so it can be started from any chapter.
// That control is named for what it will do next, "Play the tour" or "Pause
// the tour", which is also the text the rail shows beside it.
export default function ChapterRail({ items, tour = null }) {
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
    // Several changes can be delivered together when frames run late (a fast
    // flick to the footer and back): the newest one is where things stand.
    const footerObserver = new IntersectionObserver(
      entries => setHidden(entries[entries.length - 1].isIntersecting),
      { threshold: 0.2 },
    );
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
    // Choosing a chapter by hand takes the wheel from the tour.
    if (tour) tour.pause();
    setActive(id);
    const offset = typeof item.offset === 'function' ? item.offset() : item.offset || 0;
    scrollToTarget(`#${id}`, { offset });
  };

  const touring = Boolean(tour) && tour.available;
  const playing = touring && tour.status === 'playing';
  const tourLabel = playing ? 'Pause the tour' : 'Play the tour';

  return (
    <>
      <nav className={`rail${hidden ? ' is-hidden' : ''}`} aria-label="Sections" {...(hidden ? { inert: '' } : {})}>
        {touring && (
          <button
            type="button"
            className={`rail__tour${playing ? ' is-playing' : ''}`}
            data-tour-control=""
            onClick={tour.toggle}
          >
            {/* The label a visitor sees on hover is also the button's name. */}
            <span className="rail__label">{tourLabel}</span>
            <span className="rail__tour-disc"><TourIcon playing={playing} /></span>
          </button>
        )}
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
        {touring && (
          <button
            type="button"
            className={`chapter-jump__tour${playing ? ' is-playing' : ''}`}
            data-tour-control=""
            aria-label={tourLabel}
            onClick={tour.toggle}
          >
            <TourIcon playing={playing} size={11} />
          </button>
        )}
        <label htmlFor="chapter-select" className="mono">Explore</label>
        <select id="chapter-select" aria-label="Jump to a section" value={active} onChange={event => travel(event.target.value)}>
          {items.map((item, index) => <option key={item.id} value={item.id}>{String(index + 1).padStart(2, '0')} · {item.label}</option>)}
        </select>
      </div>
    </>
  );
}
