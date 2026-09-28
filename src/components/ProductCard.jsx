import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import ProductImage from './ProductImage';
import { Rating } from './Bits';
import { inr, pct } from '../lib/format';

export default function ProductCard({ product: p }) {
  const { toggleWish, wish, addToCart, setQuick, ratings, available } = useStore();
  const ref = useRef(null);
  const r = ratings[p.id];
  const off = pct(p.price, p.originalPrice);
  const out = available(p) <= 0;
  const liked = wish.includes(p.id);
  const badge = out ? 'Out of stock' : p.newArrival ? 'New' : p.bestSeller ? 'Best seller' : null;
  const second = p.images?.[2] || p.images?.[1];

  const onMove = (e) => {
    const el = ref.current;
    if (!el || e.pointerType === 'touch') return;
    const b = el.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
    el.style.setProperty('--ry', `${x * 7}deg`); el.style.setProperty('--rx', `${-y * 7}deg`);
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`); el.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
  };
  const onLeave = () => { const el = ref.current; if (el) { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); } };

  return (
    <article className="pcard" ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} data-cursor="VIEW">
      <div className="pcard__frame">
        <Link to={`/product/${p.slug}`} className="pcard__media" aria-label={`View ${p.name}`}>
          <span className="pcard__img pcard__img--a"><ProductImage product={p} index={0} /></span>
          {second && <span className="pcard__img pcard__img--b"><ProductImage product={p} image={second} /></span>}
          <span className="pcard__glow" aria-hidden="true" />
        </Link>
        {badge && <span className={`badge ${out ? 'badge--out' : ''}`}>{badge}</span>}
        <button className={`icon-btn pcard__wish ${liked ? 'is-on' : ''}`} onClick={() => toggleWish(p.id)} aria-pressed={liked} aria-label={liked ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}>
          <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
        </button>
        <div className="pcard__actions">
          <button className="pcard__quick" onClick={() => setQuick(p.id)} aria-label={`Quick view ${p.name}`}><Eye size={16} /><span>Quick view</span></button>
          <button className="pcard__add" onClick={() => addToCart(p.id)} disabled={out} data-cursor="ADD"><ShoppingBag size={16} /><span>{out ? 'Sold out' : 'Quick add'}</span></button>
        </div>
      </div>
      <div className="pcard__info">
        <h3 className="pcard__name"><Link to={`/product/${p.slug}`}>{p.name}</Link></h3>
        {r ? <Rating value={r.avg} count={r.count} size={13} /> : <span className="pcard__sub">{p.subcategory}</span>}
        <div className="price">
          <span className="price__now">{inr(p.price)}</span>
          {off > 0 && <><s className="price__was">{inr(p.originalPrice)}</s><span className="price__off">{off}% off</span></>}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ items, className = '' }) {
  return <div className={`pgrid ${className}`}>{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>;
}
