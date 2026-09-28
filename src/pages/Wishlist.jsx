import { Link } from 'react-router-dom';
import { Heart, X } from 'lucide-react';
import SEO from '../components/SEO';
import ProductImage from '../components/ProductImage';
import { Empty } from '../components/Bits';
import { useStore } from '../store/StoreContext';
import { inr, pct } from '../lib/format';

export default function Wishlist() {
  const { wishlist, toggleWish, addToCart, available } = useStore();
  return (
    <>
      <SEO title="Your Wishlist" description="Pieces you have saved at Hi Grove Furnitures." noindex />
      <div className="wrap section--tight">
        <h1 className="h1">Wishlist</h1>
        {!wishlist.length ? <Empty icon={Heart} title="YOUR COLLECTION STARTS HERE" text="Tap the heart on any piece to save it here." cta="EXPLORE FURNITURE" /> : (
          <div className="pgrid">
            {wishlist.map((p) => {
              const out = available(p) <= 0;
              return (
                <article key={p.id} className="wcard">
                  <Link to={`/product/${p.slug}`} className="wcard__img"><ProductImage product={p} index={0} /></Link>
                  <button className="icon-btn wcard__x" onClick={() => toggleWish(p.id)} aria-label={`Remove ${p.name} from wishlist`}><X size={16} /></button>
                  <h3 className="pcard__name"><Link to={`/product/${p.slug}`}>{p.name}</Link></h3>
                  <div className="price"><span className="price__now">{inr(p.price)}</span>{pct(p.price, p.originalPrice) > 0 && <s className="price__was">{inr(p.originalPrice)}</s>}</div>
                  <p className={`stock stock--${out ? 'out' : 'in'}`}>{out ? 'OUT OF STOCK' : 'IN STOCK'}</p>
                  <div className="row"><button className="btn btn--gold btn--sm" disabled={out} onClick={() => addToCart(p.id)}>ADD TO CART</button></div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
