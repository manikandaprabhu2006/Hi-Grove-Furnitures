import { useEffect, useState } from 'react';

/** Only renders when a real end date exists. */
export default function Countdown({ end }) {
  const target = end ? new Date(end).getTime() + 86399000 : null;
  const [now, setNow] = useState(Date.now());
  useEffect(() => { if (!target) return; const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, [target]);
  if (!target || target <= now) return null;
  const d = target - now, D = Math.floor(d / 864e5), H = Math.floor((d % 864e5) / 36e5), M = Math.floor((d % 36e5) / 6e4), S = Math.floor((d % 6e4) / 1e3);
  return (
    <div className="countdown" role="timer" aria-label="Time left on this offer">
      {[[D, 'days'], [H, 'hrs'], [M, 'min'], [S, 'sec']].map(([v, l]) => <span key={l}><b>{String(v).padStart(2, '0')}</b>{l}</span>)}
    </div>
  );
}
