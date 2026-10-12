import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// A panel that sweeps off the screen whenever the route changes, so moving
// between pages feels like one continuous site instead of a hard cut.
export default function RouteCurtain() {
  const location = useLocation();
  const first = useRef(true);
  const [sweep, setSweep] = useState(null);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setSweep(location.key);
  }, [location.key]);

  if (!sweep) return null;

  return (
    <div key={sweep} className="route-curtain" aria-hidden="true" onAnimationEnd={() => setSweep(null)}>
      <span className="route-curtain__mark">HG — M</span>
    </div>
  );
}
