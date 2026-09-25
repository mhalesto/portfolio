import { useEffect, useState } from 'react';
import { scrollToTarget } from '../scroll';

// A slim progress rail on the right edge of the home journey. Each tick is a
// section; hovering shows its name, clicking travels there.
export default function ChapterRail({ items }) {
  const [active, setActive] = useState(items[0] ? items[0].id : null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    items.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });
    // Step aside once the footer takes over the screen.
    const footer = document.querySelector('.site-footer');
    const footerObserver = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { threshold: 0.2 });
    if (footer) footerObserver.observe(footer);
    return () => {
      observer.disconnect();
      footerObserver.disconnect();
    };
  }, [items]);

  return (
    <nav className={`rail${hidden ? ' is-hidden' : ''}`} aria-label="Sections">
      <ol>
        {items.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              className={`rail__item${active === item.id ? ' is-active' : ''}`}
              aria-current={active === item.id ? 'true' : undefined}
              onClick={() => scrollToTarget(`#${item.id}`, { offset: item.offset || 0 })}
              style={item.color ? { '--rail-color': item.color } : undefined}
            >
              <span className="rail__label" aria-hidden="true">
                {item.label}
              </span>
              <span className="rail__tick" aria-hidden="true" />
              <span className="sr-only">{`Go to ${item.label} (${index + 1} of ${items.length})`}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
