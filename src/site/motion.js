const query = q => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q).matches : false);

export const prefersReducedMotion = () => query('(prefers-reduced-motion: reduce)');

export const hasFinePointer = () => query('(hover: hover) and (pointer: fine)');

export const isSmallScreen = () => query('(max-width: 820px)');

export function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch (error) {
    return false;
  }
}
