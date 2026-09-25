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

    return addTicker((time, delta) => {
      const half = track.scrollWidth / 2;
      if (!half) return;
      const velocity = scrollState.velocity || 0;
      if (Math.abs(velocity) > 0.4) direction = velocity > 0 ? -1 : 1;
      x += direction * (speed + Math.min(Math.abs(velocity) * 45, 1100)) * delta;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      track.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
    }, 10);
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
