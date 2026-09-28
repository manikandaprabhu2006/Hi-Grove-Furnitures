import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Heart, Minus, Plus, Maximize2, ChevronDown, Truck } from 'lucide-react';
import SEO from '../components/SEO';
import Gallery from '../components/Gallery';
import ProductImage, { imageLabel } from '../components/ProductImage';
import { ProductGrid } from '../components/ProductCard';
import { Rating } from '../components/Bits';
import NotFound from './NotFound';
import { useStore } from '../store/StoreContext';
import { inr, pct, dimText, fmtDate } from '../lib/format';
import { stockState, stockLabel } from '../lib/pricing';

function Acc({ title, children, open }) {
  const [o, setO] = useState(!!open);
  return (
    <div className={`acc ${o ? 'is-open' : ''}`}>
      <button className="acc__btn" aria-expanded={o} onClick={() => setO(!o)}>{title}<ChevronDown size={18} /></button>
      {o && <div className="acc__body">{children}</div>}
    </div>
  );
}

export default function Product() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { bySlug, products, catById, ratings, reviews, wish, toggleWish, addToCart, settings, available, lineOffer } = useStore();
  const p = bySlug[slug];
  const [i, setI] = useState(0);
  const [qty, setQty] = useState(1);
  const [lightbox, setLightbox] = useState(false);
  const [pin, setPin] = useState('');
  const [pinMsg, setPinMsg] = useState('');

  const related = useMemo(() => (p ? products.filter((x) => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 4) : []), [products, p]);
  if (!p || p.status !== 'published') return <NotFound />;

  const cat = catById[p.categoryId];
  const r = ratings[p.id];
  const off = pct(p.price, p.originalPrice);
  const avail = available(p);
  const st = stockState(p);
  const offer = lineOffer(p);
  const pRev = reviews.filter((x) => x.productId === p.id && x.status === 'approved');
  const pol = settings.policies || {};
  const fallback = `This information has not been published yet. Please call ${settings.store.phone} and we will help.`;
  const dims = dimText(p.dimensions);
  const spec = [['Material', p.material], ['Finish', p.finish], ['Style', p.style], ['Color', p.color], ['Dimensions', dims], ['Weight', p.weight], ['SKU', p.sku]].filter(([, v]) => v);

  const checkPin = (e) => {
    e.preventDefault();
    if (!/^[1-9]\d{5}$/.test(pin)) return setPinMsg('Enter a valid 6-digit PIN code.');
    setPinMsg(`Delivery estimates for ${pin} will appear here once the delivery service is connected. Call ${settings.store.phone} to confirm delivery to your area.`);
  };

  return (
    <>
      <SEO title={`${p.name} | Teak Furniture`} description={p.shortDescription || p.description.slice(0, 150)} image={p.images?.[0]?.src}
        type="product"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'Product', name: p.name, sku: p.sku, description: p.shortDescription, material: p.material, brand: { '@type': 'Brand', name: 'Hi Grove Furnitures' }, offers: { '@type': 'Offer', priceCurrency: 'INR', price: p.price, availability: avail > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' } }} />
      <div className="wrap pdp">
        <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/shop">Shop</Link>{cat && <><span>/</span><Link to={`/category/${cat.slug}`}>{cat.name}</Link></>}<span>/</span><span aria-current="page">{p.name}</span></nav>
        <div className="pdp__grid">
          <div className="pdp__gallery">
            <div className="pdp__thumbs" role="tablist" aria-label="Product images">
              {p.images.map((im, k) => (
                <button key={k} role="tab" aria-selected={k === i} className={k === i ? 'is-on' : ''} onClick={() => setI(k)} aria-label={imageLabel(im, k)}><ProductImage product={p} index={k} /></button>
              ))}
            </div>
            <button className="pdp__main" onClick={() => setLightbox(true)} data-cursor="ZOOM" aria-label="Open full screen gallery">
              <ProductImage product={p} index={i} eager />
              <span className="pdp__expand"><Maximize2 size={16} />{imageLabel(p.images[i], i)}</span>
            </button>
          </div>

          <div className="pdp__info">
            <p className="muted">{p.subcategory}</p>
            <h1 className="pdp__name">{p.name}</h1>
            {r && <Rating value={r.avg} count={r.count} size={16} />}
            <div className="price price--xl">
              <span className="price__now">{inr(p.price)}</span>
              {off > 0 && <><s className="price__was">{inr(p.originalPrice)}</s><span className="price__off">{off}% off</span></>}
            </div>
            <p className="muted small">Inclusive of applicable taxes</p>
            {offer && <p className="offer-note">Offer: {offer.offer.name}. You save {inr(offer.perUnit)} per piece, applied in your cart.</p>}
            <p className="pdp__short">{p.shortDescription}</p>

            <dl className="specs">
              {spec.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
              <div><dt>Availability</dt><dd><span className={`stock stock--${st}`}>{stockLabel[st]}</span>{st === 'low' && ` (${avail} left)`}</dd></div>
            </dl>

            <div className="buy">
              <div className="qty" role="group" aria-label="Quantity">
                <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity"><Minus size={16} /></button>
                <output aria-live="polite">{qty}</output>
                <button onClick={() => setQty(Math.min(Math.max(1, avail), qty + 1))} aria-label="Increase quantity"><Plus size={16} /></button>
              </div>
              <button className="btn btn--gold btn--grow" disabled={avail <= 0} onClick={() => addToCart(p.id, qty)}>ADD TO CART</button>
              <button className={`icon-btn icon-btn--bordered ${wish.includes(p.id) ? 'is-on' : ''}`} onClick={() => toggleWish(p.id)} aria-pressed={wish.includes(p.id)} aria-label="Save to wishlist"><Heart size={20} fill={wish.includes(p.id) ? 'currentColor' : 'none'} /></button>
            </div>
            <button className="btn btn--dark btn--block" disabled={avail <= 0} onClick={() => { if (addToCart(p.id, qty)) nav('/checkout'); }}>BUY NOW</button>

            <form className="pin" onSubmit={checkPin}>
              <label htmlFor="pin"><Truck size={16} />Delivery</label>
              <div className="pin__row">
                <input id="pin" inputMode="numeric" maxLength={6} placeholder="Enter PIN code" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} />
                <button className="btn btn--ghost btn--sm" type="submit">CHECK</button>
              </div>
              {pinMsg && <p className="small muted" role="status">{pinMsg}</p>}
            </form>

            <div className="accs">
              <Acc title="Description" open><p>{p.description}</p></Acc>
              <Acc title="Dimensions">{dims ? <p>{dims}{p.weight ? `. Weight ${p.weight}.` : ''}</p> : <p>{fallback}</p>}</Acc>
              <Acc title="Materials"><p>{[p.material && `Material: ${p.material}`, p.finish && `Finish: ${p.finish}`].filter(Boolean).join('. ') || fallback}</p></Acc>
              <Acc title="Care instructions"><p>{pol.care || fallback}</p></Acc>
              <Acc title="Delivery"><p>{pol.delivery || fallback}</p></Acc>
              <Acc title="Returns"><p>{pol.returns || fallback}</p></Acc>
              <Acc title="Warranty"><p>{pol.warranty || fallback}</p></Acc>
            </div>
          </div>
        </div>

        <section className="section--tight" aria-labelledby="rev-h">
          <h2 id="rev-h" className="h2">Reviews</h2>
          {pRev.length ? (
            <div className="reviews">
              {pRev.map((rv) => (
                <article key={rv.id} className="review">
                  <Rating value={rv.rating} showNumber={false} /><p>{rv.review}</p>
                  <small>{rv.customer}{rv.location ? `, ${rv.location}` : ''} · {fmtDate(rv.createdAt)}</small>
                  {rv.sample && <em className="tm__tag">Sample review</em>}
                </article>
              ))}
            </div>
          ) : <p className="muted">There are no reviews for this piece yet.</p>}
        </section>

        {related.length > 0 && (
          <section className="section--tight" aria-labelledby="rel-h">
            <h2 id="rel-h" className="h2">You may also like</h2>
            <ProductGrid items={related} />
          </section>
        )}
      </div>

      <div className="stickybuy">
        <div><b>{inr(p.price)}</b><small>{p.name}</small></div>
        <button className="btn btn--gold btn--sm" disabled={avail <= 0} onClick={() => addToCart(p.id, qty)}>{avail <= 0 ? 'SOLD OUT' : 'ADD TO CART'}</button>
      </div>

      <AnimatePresence>{lightbox && <Gallery product={p} index={i} onIndex={setI} onClose={() => setLightbox(false)} />}</AnimatePresence>
    </>
  );
}
