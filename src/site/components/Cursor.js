import { useEffect, useRef, useState } from 'react';
import { addTicker, cursorStore } from '../ticker';
import { hasFinePointer } from '../motion';

// A precise dot plus a trailing ring. The ring grows over links and turns into
// a labelled disc over interactive objects, whether they live in the DOM
// (data-cursor="Label") or inside the WebGL canvas (via cursorStore).
export default function Cursor() {
  const [enabled] = useState(() => hasFinePointer());
  const rootRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;
    const root = rootRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    document.documentElement.classList.add('has-cursor');

    let mouseX = -100;
    let mouseY = -100;
    let ringX = mouseX;
    let ringY = mouseY;
    let visible = false;
    let domTarget = null;
    let domLabel = '';
    let sceneState = cursorStore.get();

    const apply = () => {
      const sceneLabel = !domTarget && sceneState.active ? sceneState.label : '';
      const text = domLabel || sceneLabel;
      label.textContent = text;
      root.classList.toggle('is-link', Boolean(domTarget) && !text);
      root.classList.toggle('has-label', Boolean(text));
      root.style.setProperty('--cursor-accent', !domTarget && sceneState.color ? sceneState.color : '');
    };

    const onMove = event => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (!visible) {
        visible = true;
        ringX = mouseX;
        ringY = mouseY;
        root.classList.add('is-visible');
      }
    };
    const onOver = event => {
      const target = event.target instanceof Element ? event.target.closest('a, button, [data-cursor]') : null;
      domTarget = target;
      domLabel = target ? target.getAttribute('data-cursor') || '' : '';
      apply();
    };
    const onLeave = () => {
      visible = false;
      root.classList.remove('is-visible');
    };
    const onDown = () => root.classList.add('is-down');
    const onUp = () => root.classList.remove('is-down');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    const unsubscribe = cursorStore.subscribe(state => {
      sceneState = state;
      apply();
    });

    const removeTicker = addTicker((time, delta) => {
      const k = 1 - Math.exp(-delta * 16);
      ringX += (mouseX - ringX) * k;
      ringY += (mouseY - ringY) * k;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, 20);

    return () => {
      removeTicker();
      unsubscribe();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.classList.remove('has-cursor');
      cursorStore.set({ active: false, label: '', color: '' });
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="cursor" ref={rootRef} aria-hidden="true">
      <div className="cursor__ring" ref={ringRef}>
        <span className="cursor__disc">
          <span className="cursor__label" ref={labelRef} />
        </span>
      </div>
      <div className="cursor__dot" ref={dotRef} />
    </div>
  );
}
