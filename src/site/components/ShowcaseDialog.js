import { useEffect, useRef, useState } from 'react';
import { setScrollLocked } from '../scroll';
import './showcase.css';

export default function ShowcaseDialog({ showcase, onClose }) {
  const [index, setIndex] = useState(0);
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!showcase) return undefined;
    setIndex(0);
    const returnFocus = document.activeElement;
    const panel = panelRef.current;
    const background = Array.from(panel.parentElement.parentElement.children)
      .filter(element => element !== panel.parentElement)
      .map(element => ({ element, inert: element.getAttribute('inert') }));
    background.forEach(({ element }) => element.setAttribute('inert', ''));
    setScrollLocked(true, 'showcase');
    closeRef.current.focus({ preventScroll: true });
    const onKey = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        setIndex(current => (current + direction + showcase.images.length) % showcase.images.length);
      }
      if (event.key !== 'Tab') return;
      const controls = Array.from(panel.querySelectorAll('button:not([disabled]), a[href]'));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      background.forEach(({ element, inert }) => {
        if (inert === null) element.removeAttribute('inert');
        else element.setAttribute('inert', inert);
      });
      setScrollLocked(false, 'showcase');
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };
    // Only change ownership when the gallery opens or closes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showcase]);

  if (!showcase) return null;
  const image = showcase.images[index] || showcase.images[0];

  return (
    <div className="showcase" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="showcase__panel" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="showcase-title" data-lenis-prevent>
        <header className="showcase__header">
          <h2 id="showcase-title">{showcase.title}</h2>
          <button ref={closeRef} type="button" className="showcase__close" onClick={onClose} aria-label="Close preview">×</button>
        </header>
        <figure className="showcase__figure">
          <img key={image.src} src={image.src} alt={image.alt} width={image.width} height={image.height} decoding="async" />
          <figcaption aria-live="polite">{image.caption}</figcaption>
        </figure>
        <div className="showcase__controls">
          {showcase.images.length > 1 && <>
            <button type="button" onClick={() => setIndex(current => (current - 1 + showcase.images.length) % showcase.images.length)} aria-label="Previous example">←</button>
            <span className="mono" aria-live="polite">{index + 1} / {showcase.images.length}</span>
            <button type="button" onClick={() => setIndex(current => (current + 1) % showcase.images.length)} aria-label="Next example">→</button>
          </>}
          <a href={image.src} target="_blank" rel="noreferrer" className="text-link">Open full size <span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </div>
  );
}
