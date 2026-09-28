import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export function Rating({ value = 0, count, size = 14, showNumber = true }) {
  const full = Math.round(value);
  return (
    <span className="rating" aria-label={`Rated ${value.toFixed(1)} out of 5${count ? ` from ${count} reviews` : ''}`}>
      <span className="rating__stars" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={size} className={i <= full ? 'on' : ''} />)}
      </span>
      {showNumber && <span className="rating__n">{value.toFixed(1)}{count ? <span> ({count})</span> : null}</span>}
    </span>
  );
}

export function Empty({ title, text, cta = 'EXPLORE COLLECTION', to = '/shop', icon: Icon }) {
  return (
    <div className="empty">
      {Icon && <Icon size={40} strokeWidth={1.2} />}
      <h2 className="empty__title">{title}</h2>
      {text && <p>{text}</p>}
      {cta && <Link to={to} className="btn btn--gold">{cta}</Link>}
    </div>
  );
}

export const Skeleton = ({ className = '', style }) => <div className={`skel ${className}`} style={style} aria-hidden="true" />;
export const ProductSkeletons = ({ n = 8 }) => (
  <div className="pgrid" aria-busy="true">
    {Array.from({ length: n }, (_, i) => (
      <div key={i}><Skeleton className="skel--img" /><Skeleton style={{ height: 14, width: '70%', marginTop: 14 }} /><Skeleton style={{ height: 14, width: '40%', marginTop: 8 }} /></div>
    ))}
  </div>
);

/** Brand lockup: real logo mark + wordmark set in teak-grain lettering. */
export function Brand({ tone = 'light', compact = false }) {
  return (
    <span className={`brand brand--${tone}`}>
      <img src="/brand/logo-mark.webp" alt="" width="60" height="45" className="brand__mark" decoding="async" />
      {!compact && (
        <span className="brand__word">
          <span className={`brand__name wood-text wood-text--${tone === 'light' ? 'light' : 'dark'}`}>HI GROVE</span>
          <span className="brand__sub">FURNITURES</span>
        </span>
      )}
    </span>
  );
}

export const Toasts = ({ items }) => (
  <div className="toasts" role="status" aria-live="polite">
    {items.map((t) => <div key={t.id} className={`toast toast--${t.tone}`}>{t.message}</div>)}
  </div>
);
