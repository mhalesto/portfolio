import { useEffect } from 'react';
import { prefersReducedMotion } from './motion';

// Marks every [data-reveal] element inside the page with data-in once it
// scrolls into view. CSS owns the actual animation.
export default function useReveal(rootRef, deps = []) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const elements = Array.from(root.querySelectorAll('[data-reveal]:not([data-in])'));
    if (!elements.length) return undefined;

    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
      elements.forEach(element => element.setAttribute('data-in', ''));
      return undefined;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-in', '');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    elements.forEach(element => observer.observe(element));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
