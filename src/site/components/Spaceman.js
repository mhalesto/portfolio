import { useEffect, useRef, useState } from 'react';
import { addTicker } from '../ticker';
import { prefersReducedMotion } from '../motion';
import { phoneLeftEdge, placeSpaceman } from '../spaceman';

const FIGURE = `${process.env.PUBLIC_URL}/experience/astronaut.webp`;
const ORB = `${process.env.PUBLIC_URL}/experience/universe.webp`;

// Reads the hero's boxes and works out where the astronaut fits. Positions
// come from offsets, which ignore the entrance transforms the copy plays.
function measure(node) {
  const hero = node.parentElement;
  const title = hero && hero.querySelector('.hero__title');
  if (!hero || !title) return null;
  const heroBox = hero.getBoundingClientRect();
  const style = window.getComputedStyle(hero);
  const gutter = parseFloat(style.paddingLeft) || 0;
  const width = hero.clientWidth;
  const height = Math.min(hero.clientHeight, window.innerHeight || hero.clientHeight);
  const stacked = width < 760 || width / (window.innerHeight || height) < 0.95;
  const words = Array.from(title.querySelectorAll('.split__word'));
  const nameRight = words.reduce((right, word) => Math.max(right, word.getBoundingClientRect().right - heroBox.left), 0);
  const top = hero.querySelector('.hero__top');
  const fallback = hero.querySelector('.hero__fallback');
  const grid = fallback && window.getComputedStyle(fallback).position === 'absolute' ? fallback.offsetLeft : null;
  return placeSpaceman({
    width,
    height,
    gutter,
    stacked,
    title: { top: title.offsetTop, height: title.offsetHeight },
    nameRight: nameRight || NaN,
    skyTop: top ? top.offsetTop + top.offsetHeight : gutter,
    rightLimit: stacked ? width - gutter : grid !== null ? grid : phoneLeftEdge(width, height),
  });
}

// An astronaut adrift beside the name, holding out a small universe. Purely
// decorative. The figure and the orb float on their own rhythms, and both
// lean a little toward the pointer, the orb further, as if it were nearer.
export default function Spaceman() {
  const ref = useRef(null);
  const [place, setPlace] = useState(null);
  // Out of sight further down the journey, he rests: no floating, no leaning.
  const [inView, setInView] = useState(true);
  const inViewRef = useRef(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(entries => {
      const visible = entries[entries.length - 1].isIntersecting;
      inViewRef.current = visible;
      setInView(visible);
    });
    observer.observe(node.parentElement);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const next = measure(node);
      setPlace(current => {
        if (!next) return null;
        const rounded = { left: Math.round(next.left), top: Math.round(next.top), width: Math.round(next.width), mode: next.mode };
        return current && ['left', 'top', 'width', 'mode'].every(key => current[key] === rounded[key]) ? current : rounded;
      });
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('resize', schedule);
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    if (observer) {
      observer.observe(node.parentElement);
      const title = node.parentElement.querySelector('.hero__title');
      if (title) observer.observe(title);
    }
    let live = true;
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => live && schedule());
    return () => {
      live = false;
      window.removeEventListener('resize', schedule);
      if (observer) observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Lean toward the pointer. Eased on the shared ticker; idle frames cost one comparison.
  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return undefined;
    if (typeof window.matchMedia !== 'function' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    const target = { x: 0, y: 0 };
    const shown = { x: 0, y: 0 };
    const onMove = event => {
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    const removeTicker = addTicker((time, delta) => {
      if (!inViewRef.current) return;
      const dx = target.x - shown.x;
      const dy = target.y - shown.y;
      if (Math.abs(dx) < 0.002 && Math.abs(dy) < 0.002) return;
      const ease = 1 - Math.exp(-Math.min(delta, 0.1) * 3.2);
      shown.x += dx * ease;
      shown.y += dy * ease;
      node.style.setProperty('--lean-x', shown.x.toFixed(3));
      node.style.setProperty('--lean-y', shown.y.toFixed(3));
    }, 20);
    return () => {
      window.removeEventListener('pointermove', onMove);
      removeTicker();
    };
  }, []);

  const style = place
    ? { '--spaceman-left': `${place.left}px`, '--spaceman-top': `${place.top}px`, '--spaceman-width': `${place.width}px` }
    : undefined;

  return (
    <div
      ref={ref}
      className={`spaceman${place ? ` is-placed spaceman--${place.mode}` : ''}${inView ? '' : ' is-resting'}`}
      style={style}
      aria-hidden="true"
    >
      {/* Where there is no room for him, nothing is fetched or animated. */}
      {place && (
        <>
          <div className="spaceman__lean">
            <img className="spaceman__figure" src={FIGURE} alt="" width="960" height="594" decoding="async" draggable="false" />
          </div>
          <div className="spaceman__orb">
            <span className="spaceman__halo" />
            <img className="spaceman__universe" src={ORB} alt="" width="203" height="209" decoding="async" draggable="false" />
            <i className="spaceman__star spaceman__star--a" />
            <i className="spaceman__star spaceman__star--b" />
            <i className="spaceman__star spaceman__star--c" />
          </div>
        </>
      )}
    </div>
  );
}
