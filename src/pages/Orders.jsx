import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Check } from 'lucide-react';
import SEO from '../components/SEO';
import ProductImage from '../components/ProductImage';
import { Empty } from '../components/Bits';
import NotFound from './NotFound';
import { useRepo } from '../services/db';
import { ORDER_STEPS, STATUS_TO_STEP } from '../services/orders';
import { inr, fmtDate } from '../lib/format';

export function OrdersList({ embedded = false }) {
  const [orders] = useRepo('orders');
  const nav = useNavigate();
  const [id, setId] = useState('');
  const mine = orders.filter((o) => o.userId === 'u_demo');
  const body = mine.length ? (
    <div className="tablewrap"><table className="tbl">
      <thead><tr><th>Order ID</th><th>Date</th><th>Status</th><th className="num">Total</th><th /></tr></thead>
      <tbody>{mine.map((o) => <tr key={o.id}><td data-l="Order ID">{o.id}</td><td data-l="Date">{fmtDate(o.createdAt)}</td><td data-l="Status"><span className={`pill pill--${o.orderStatus.replace(/\s/g, '').toLowerCase()}`}>{o.orderStatus}</span></td><td className="num" data-l="Total">{inr(o.total)}</td><td><Link className="link" to={`/orders/${o.id}`}>View order</Link></td></tr>)}</tbody>
    </table></div>
  ) : <Empty icon={Package} title="NO ORDERS YET." text="When you place an order it will appear here." cta="EXPLORE COLLECTION" />;
  if (embedded) return body;
  return (
    <>
      <SEO title="My Orders" description="Track your Hi Grove Furnitures orders." noindex />
      <div className="wrap section--tight">
        <h1 className="h1">Orders</h1>
        <form className="lookup" onSubmit={(e) => { e.preventDefault(); if (id.trim()) nav(`/orders/${id.trim().toUpperCase()}`); }}>
          <label htmlFor="oid">Track an order by ID</label>
          <div className="pin__row"><input id="oid" value={id} onChange={(e) => setId(e.target.value)} placeholder="HGF-100200" /><button className="btn btn--ghost btn--sm">TRACK</button></div>
        </form>
        {body}
      </div>
    </>
  );
}

export function OrderTrack() {
  const { id } = useParams();
  const { state } = useLocation();
  const [orders] = useRepo('orders');
  const o = orders.find((x) => x.id === id);
  if (!o) return <NotFound />;
  const cancelled = o.orderStatus === 'Cancelled';
  const cur = STATUS_TO_STEP[o.orderStatus] ?? 0;
  const at = (label, i) => o.timeline?.find((t) => (t.status === 'Pending' ? 'Order Placed' : t.status) === label)?.at;
  return (
    <>
      <SEO title={`Order ${o.id}`} description="Order tracking" noindex />
      <div className="wrap section--tight track">
        {state?.placed && <div className="notice notice--ok" role="status"><Check size={18} />Thank you. Your order {o.id} has been placed. We will confirm it shortly.</div>}
        <Link to="/orders" className="link">All orders</Link>
        <h1 className="h1">Order {o.id}</h1>
        <p className="muted">Placed on {fmtDate(o.createdAt)}. Payment: {o.paymentMethod?.toUpperCase()} ({o.paymentStatus}).</p>
        {cancelled ? <div className="notice notice--warn">This order was cancelled.</div> : (
          <ol className="timeline" aria-label="Order progress">
            {ORDER_STEPS.map((s, i) => (
              <motion.li key={s} className={i < cur ? 'is-done' : i === cur ? 'is-now' : ''} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.09, duration: 0.4 }}>
                <span className="timeline__dot">{i <= cur && <Check size={12} />}</span>
                <span className="timeline__label">{s}</span>
                {at(s, i) && <small>{fmtDate(at(s, i), { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</small>}
              </motion.li>
            ))}
          </ol>
        )}
        <div className="track__grid">
          <section className="panel"><h2 className="h3">Items</h2>
            <ul className="lines lines--plain">{o.items.map((it) => (
              <li key={it.productId} className="line line--sm"><div className="line__img"><ProductImage image={it.image} product={{ name: it.name, shape: 'side' }} /></div><div><b>{it.name}</b><p className="muted small">Qty {it.qty} × {inr(it.price)}</p></div><p className="line__sub">{inr(it.price * it.qty)}</p></li>
            ))}</ul>
          </section>
          <section className="panel"><h2 className="h3">Delivering to</h2>
            <address>{o.shippingAddress?.name}<br />{[o.shippingAddress?.line1, o.shippingAddress?.street, o.shippingAddress?.area].filter(Boolean).join(', ')}<br />{[o.shippingAddress?.city, o.shippingAddress?.district].filter(Boolean).join(', ')}, {o.shippingAddress?.state} {o.shippingAddress?.pin}</address>
            <dl className="mini"><div><dt>Subtotal</dt><dd>{inr(o.subtotal)}</dd></div><div><dt>Discount</dt><dd>−{inr(o.discount)}</dd></div><div><dt>Shipping</dt><dd>{o.shipping ? inr(o.shipping) : 'Free'}</dd></div><div><dt>Tax included</dt><dd>{inr(o.tax)}</dd></div><div className="total"><dt>Total</dt><dd>{inr(o.total)}</dd></div></dl>
          </section>
        </div>
      </div>
    </>
  );
}
