import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, Bookmark, ShoppingBag, Tag } from 'lucide-react';
import SEO from '../components/SEO';
import ProductImage from '../components/ProductImage';
import { Empty } from '../components/Bits';
import { useStore } from '../store/StoreContext';
import { inr } from '../lib/format';

export function Summary({ totals, children, cta }) {
  return (
    <aside className="summary" aria-label="Order summary">
      <h2 className="summary__h">ORDER SUMMARY</h2>
      <dl>
        <div><dt>Subtotal</dt><dd>{inr(totals.subtotal)}</dd></div>
        {totals.items.filter((i) => i.offerOff > 0).map((i) => <div key={i.product.id} className="sub"><dt>{i.offer.name}</dt><dd>−{inr(i.offerOff)}</dd></div>)}
        {totals.bundles.map((b) => <div key={b.offer.id} className="sub"><dt>{b.offer.name}</dt><dd>−{inr(b.off)}</dd></div>)}
        {totals.couponDiscount > 0 && <div className="sub"><dt>Coupon {totals.coupon.code}</dt><dd>−{inr(totals.couponDiscount)}</dd></div>}
        <div><dt>Discount</dt><dd>{totals.discount ? `−${inr(totals.discount)}` : inr(0)}</dd></div>
        <div><dt>Shipping</dt><dd>{totals.items.length ? (totals.shipping ? inr(totals.shipping) : 'Free') : '—'}</dd></div>
        <div><dt>{totals.taxLabel}{totals.taxInclusive ? ' (included)' : ''}</dt><dd>{inr(totals.tax)}</dd></div>
        <div className="total"><dt>Grand total</dt><dd>{inr(totals.total)}</dd></div>
      </dl>
      {totals.freeShipGap > 0 && <p className="small muted">Add {inr(totals.freeShipGap)} more for free shipping.</p>}
      {children}
      {cta}
    </aside>
  );
}

export default function Cart() {
  const { lines, totals, setQty, removeLine, saveForLater, saved, addToCart, removeSaved, cart, setCoupon } = useStore();
  const nav = useNavigate();
  const [code, setCode] = useState(cart.coupon || '');

  return (
    <>
      <SEO title="Your Cart" description="Review the teak furniture in your cart." noindex />
      <div className="wrap section--tight">
        <h1 className="h1">Cart</h1>
        {!lines.length ? (
          <Empty icon={ShoppingBag} title="YOUR CART IS WAITING FOR SOMETHING BEAUTIFUL." cta="EXPLORE COLLECTION" />
        ) : (
          <div className="cartgrid">
            <ul className="lines">
              {totals.items.map((l) => (
                <li key={l.product.id} className="line">
                  <Link to={`/product/${l.product.slug}`} className="line__img"><ProductImage product={l.product} index={0} /></Link>
                  <div className="line__body">
                    <h3><Link to={`/product/${l.product.slug}`}>{l.product.name}</Link></h3>
                    <p className="muted small">{l.product.finish || l.product.material}</p>
                    <p className="line__price">{inr(l.unit)}</p>
                    {l.offerOff > 0 && <p className="offer-note">{l.offer.name}: −{inr(l.offerOff)}</p>}
                    <div className="line__ctl">
                      <div className="qty qty--sm" role="group" aria-label={`Quantity of ${l.product.name}`}>
                        <button onClick={() => setQty(l.product.id, l.qty - 1)} aria-label="Decrease quantity"><Minus size={14} /></button>
                        <output>{l.qty}</output>
                        <button onClick={() => setQty(l.product.id, l.qty + 1)} aria-label="Increase quantity"><Plus size={14} /></button>
                      </div>
                      <button className="link" onClick={() => saveForLater(l.product.id)}><Bookmark size={14} />Save for later</button>
                      <button className="link link--danger" onClick={() => removeLine(l.product.id)}><Trash2 size={14} />Remove</button>
                    </div>
                  </div>
                  <p className="line__sub"><span className="sr">Subtotal </span>{inr(l.gross)}</p>
                </li>
              ))}
            </ul>
            <Summary totals={totals}
              cta={<button className="btn btn--gold btn--block" onClick={() => nav('/checkout')}>PROCEED TO CHECKOUT</button>}>
              <form className="coupon" onSubmit={(e) => { e.preventDefault(); setCoupon(code.trim()); }}>
                <label htmlFor="cp"><Tag size={15} />Coupon code</label>
                <div className="pin__row"><input id="cp" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Enter code" /><button className="btn btn--ghost btn--sm" type="submit">APPLY</button></div>
                {cart.coupon && totals.couponError && <p className="error small" role="alert">{totals.couponError}</p>}
                {totals.coupon && <p className="ok small">Coupon applied. <button type="button" className="link" onClick={() => { setCoupon(''); setCode(''); }}>Remove</button></p>}
              </form>
            </Summary>
          </div>
        )}
        {saved.length > 0 && (
          <section className="section--tight" aria-labelledby="sv-h">
            <h2 id="sv-h" className="h2">Saved for later</h2>
            <ul className="saved">
              {saved.map((p) => (
                <li key={p.id}><div className="line__img"><ProductImage product={p} index={0} /></div><div><Link to={`/product/${p.slug}`}>{p.name}</Link><p>{inr(p.price)}</p>
                  <button className="link" onClick={() => addToCart(p.id)}>Move to cart</button> <button className="link link--danger" onClick={() => removeSaved(p.id)}>Remove</button></div></li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
