import { useEffect, useRef, useState } from 'react';
import { addTicker, loadStore } from '../ticker';
import { setScrollLocked } from '../scroll';

const MIN_SECONDS = 1.5;
const MAX_SECONDS = 14;

// Counts up while the 3D scene and its textures load, then lifts away.
export default function Preloader({ onLeave, onDone }) {
  const [leaving, setLeaving] = useState(false);
  const counterRef = useRef(null);
  const barRef = useRef(null);
  const onDoneRef = useRef(onDone);
  const onLeaveRef = useRef(onLeave);
  onDoneRef.current = onDone;
  onLeaveRef.current = onLeave;

  useEffect(() => {
    const start = performance.now();
    let shown = 0;
    let finished = false;
    let timer = 0;
    setScrollLocked(true);

    const finish = () => {
      if (finished) return;
      finished = true;
      setLeaving(true);
      setScrollLocked(false);
      if (onLeaveRef.current) onLeaveRef.current();
      timer = window.setTimeout(() => onDoneRef.current && onDoneRef.current(), 1100);
    };

    const removeTicker = addTicker((time, delta) => {
      if (finished) return;
      const { progress, ready } = loadStore.get();
      const elapsed = (performance.now() - start) / 1000;
      const pace = Math.min(1, elapsed / MIN_SECONDS);
      const target = Math.min(pace, ready ? 1 : Math.min(progress, 0.94));
      shown += (target - shown) * (1 - Math.exp(-delta * 6));
      if (target === 1 && shown > 0.996) shown = 1;
      if (counterRef.current) counterRef.current.textContent = String(Math.round(shown * 100)).padStart(3, '0');
      if (barRef.current) barRef.current.style.transform = `scaleX(${shown.toFixed(4)})`;
      if (shown === 1 || elapsed > MAX_SECONDS) finish();
    }, 5);

    return () => {
      removeTicker();
      window.clearTimeout(timer);
      setScrollLocked(false);
    };
  }, []);

  return (
    <div className={`preloader${leaving ? ' is-leaving' : ''}`} role="status" aria-label="Loading">
      <div className="preloader__top">
        <span className="brand brand--static">
          <span>HG</span>
          <span className="brand__rule" aria-hidden="true" />
          <span>M</span>
        </span>
        <span className="preloader__note">Portfolio · South Africa</span>
      </div>
      <p className="preloader__line">
        <span>Charging the current</span>
      </p>
      <div className="preloader__bottom">
        <span className="preloader__count" ref={counterRef}>
          000
        </span>
        <span className="preloader__bar">
          <span ref={barRef} />
        </span>
      </div>
    </div>
  );
}
