import { useCallback, useEffect, useRef, useState } from 'react';
import { createTour } from './tour';

// React's handle on the tour: its status for the controls, and a ref for the
// progress bar, which is moved directly so a frame of touring never re-renders
// the page.
export default function useTour(plan, enabled, { onStart } = {}) {
  const [status, setStatus] = useState('idle');
  const barRef = useRef(null);
  const tourRef = useRef(null);
  const onStartRef = useRef(onStart);
  onStartRef.current = onStart;

  useEffect(() => {
    if (!enabled) return undefined;
    const tour = createTour(plan, {
      onStatus: next => {
        setStatus(next);
        if (next === 'playing' && onStartRef.current) onStartRef.current();
      },
      onProgress: value => {
        if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, value)).toFixed(4)})`;
      },
    });
    tourRef.current = tour;
    return () => {
      tour.dispose();
      tourRef.current = null;
    };
  }, [plan, enabled]);

  const play = useCallback(() => tourRef.current && tourRef.current.play(), []);
  const pause = useCallback(() => tourRef.current && tourRef.current.pause(), []);
  const toggle = useCallback(() => tourRef.current && tourRef.current.toggle(), []);

  return { available: Boolean(enabled), status: enabled ? status : 'idle', play, pause, toggle, barRef };
}
