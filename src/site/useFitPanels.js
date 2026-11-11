import { useEffect } from 'react';

// Breakpoints can only guess how tall a pinned panel will be: it depends on
// how its lines wrap at this width, in this font. This measures instead. Any
// panel taller than the pinned screen it sits in is scaled down just enough
// to fit, so nothing is ever cropped at the top or bottom.
//   selector: the panels, each a direct child of its pinned (sticky) parent
//   floor:    never scale below this; smaller than that is hard to read, and
//             the stylesheet stops pinning before windows get that short
export function fitPanels(root, selector, floor = 0.74) {
  if (!root) return;
  root.querySelectorAll(selector).forEach(panel => {
    const pinned = panel.parentElement;
    const style = pinned ? window.getComputedStyle(pinned) : null;
    // Layouts that scroll their copy (stacked, unpinned, static) need no help.
    if (!style || style.position !== 'sticky') {
      panel.style.scale = '';
      return;
    }
    const room = pinned.clientHeight - (parseFloat(style.paddingTop) || 0) - (parseFloat(style.paddingBottom) || 0);
    // offsetHeight is the laid-out height, whatever scale is already applied.
    const height = panel.offsetHeight;
    const scale = height > room && room > 0 ? Math.max(floor, room / height) : 1;
    panel.style.scale = scale < 0.999 ? scale.toFixed(4) : '';
  });
}

export default function useFitPanels(rootRef, selector, floor) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === 'undefined') return undefined;
    let frame = 0;
    let disposed = false;
    const run = () => {
      frame = 0;
      if (!disposed) fitPanels(root, selector, floor);
    };
    // Coalesce bursts of resize notifications into one measurement.
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(run);
    };
    run();
    window.addEventListener('resize', schedule);
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
    if (observer) root.querySelectorAll(selector).forEach(panel => observer.observe(panel));
    // Line breaks move when the self-hosted fonts replace the fallbacks.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
    return () => {
      disposed = true;
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', schedule);
      if (observer) observer.disconnect();
    };
  }, [rootRef, selector, floor]);
}
