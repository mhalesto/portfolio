import { useEffect, useState } from 'react';
import { person } from '../data';

const formatter = new Intl.DateTimeFormat('en-ZA', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: person.timeZone,
});

export default function LocalTime({ suffix = ' SAST' }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time dateTime={now.toISOString()} className="local-time">
      {formatter.format(now)}
      {suffix}
    </time>
  );
}
