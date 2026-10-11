import { useEffect, useRef } from 'react';
import { addTicker } from '../ticker';
import { scrollState } from '../scroll';
import { prefersReducedMotion } from '../motion';

// An endless line of words that speeds up with scroll velocity and flips
// direction with the scroll direction.
export default function Marquee({ items, speed = 70 }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return undefined;
    let x = 0;
    let direction = -1;
    let half = 0;
    let disposed = false;
    let removeTicker = null;

    const measure = () => {
      half = track.scrollWidth / 2;
      if (half) x = -(((-x % half) + half) % half);
    };
    measure();
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (resizeObserver) resizeObserver.observe(track);
    else window.addEventListener('resize', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => {
      if (!disposed) measure();
    });

    const update = (time, delta) => {
      if (!half) return;
      const velocity = scrollState.velocity || 0;
      if (Math.abs(velocity) > 0.4) direction = velocity > 0 ? -1 : 1;
      x += direction * (speed + Math.min(Math.abs(velocity) * 45, 1100)) * delta;
      x = -(((-x % half) + half) % half);
      track.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
    };
    const setVisible = visible => {
      if (visible && !removeTicker) removeTicker = addTicker(update, 10);
      else if (!visible && removeTicker) {
        removeTicker();
        removeTicker = null;
      }
    };
    const observer = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '160px' })
      : null;
    if (observer) observer.observe(track.parentElement);
    else setVisible(true);

    return () => {
      disposed = true;
      if (removeTicker) removeTicker();
      if (observer) observer.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener('resize', measure);
    };
  }, [speed]);

  const renderRow = prefix =>
    items.map((item, index) => (
      <span className="marquee__item" key={`${prefix}-${index}`}>
        {item}
        <span className="marquee__star">✦</span>
      </span>
    ));

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track" ref={trackRef}>
        {renderRow('a')}
        {renderRow('b')}
      </div>
    </div>
  );
}
