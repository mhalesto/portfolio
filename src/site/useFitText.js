import { useLayoutEffect } from 'react';

const REFERENCE = 100;

// Sizes one line of text so it spans the content width of its container.
// CSS gives a close first guess; this corrects it for the real font metrics,
// so the line still fits when the name or the font changes.
//   trim: blank space inside the text's box that carries no ink, in em (the
//         side bearings of the first and last letters), so the ink itself,
//         not its box, reaches both edges.
export default function useFitText(ref, { min = 48, max = 640, trim = 0 } = {}) {
  useLayoutEffect(() => {
    const element = ref.current;
    const container = element && element.parentElement;
    if (!container || typeof window === 'undefined') return undefined;
    let disposed = false;
    let lastWidth = -1;

    const fit = force => {
      if (disposed) return;
      const style = window.getComputedStyle(container);
      const available = container.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
      if (!(available > 0) || (!force && Math.abs(available - lastWidth) < 0.5)) return;
      lastWidth = available;
      element.style.fontSize = `${REFERENCE}px`;
      const own = window.getComputedStyle(element);
      const padding = (parseFloat(own.paddingLeft) || 0) + (parseFloat(own.paddingRight) || 0);
      const natural = (element.getBoundingClientRect().width - padding) / REFERENCE - trim;
      if (!(natural > 0)) {
        element.style.fontSize = '';
        return;
      }
      element.style.fontSize = `${Math.min(max, Math.max(min, available / natural)).toFixed(2)}px`;
    };

    fit(true);
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => fit(false)) : null;
    if (observer) observer.observe(container);
    else window.addEventListener('resize', fit);
    // Metrics change when the self-hosted face replaces the fallback.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fit(true));

    return () => {
      disposed = true;
      if (observer) observer.disconnect();
      else window.removeEventListener('resize', fit);
    };
  }, [ref, min, max, trim]);
}
