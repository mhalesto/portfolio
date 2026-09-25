import { useEffect, useRef } from 'react';
import { addTicker } from '../ticker';
import { hasFinePointer, prefersReducedMotion } from '../motion';

// Pulls its child gently toward the pointer while hovered.
export default function Magnetic({ children, strength = 0.32, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !hasFinePointer() || prefersReducedMotion()) return undefined;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;

    const onMove = event => {
      const rect = element.getBoundingClientRect();
      targetX = (event.clientX - (rect.left + rect.width / 2)) * strength;
      targetY = (event.clientY - (rect.top + rect.height / 2)) * strength;
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    element.addEventListener('pointermove', onMove);
    element.addEventListener('pointerleave', onLeave);
    const removeTicker = addTicker((time, delta) => {
      const dx = targetX - x;
      const dy = targetY - y;
      if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;
      const k = 1 - Math.exp(-delta * 10);
      x += dx * k;
      y += dy * k;
      element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    }, 10);

    return () => {
      removeTicker();
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerleave', onLeave);
    };
  }, [strength]);

  return (
    <span ref={ref} className={`magnetic ${className}`}>
      {children}
    </span>
  );
}
