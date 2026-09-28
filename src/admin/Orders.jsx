import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useRepo, repo } from '../services/db';
import { useStore } from '../store/StoreContext';
import { DataTable, PageHead, Pill, Sel } from './ui';
import ProductImage from '../components/ProductImage';
import { setOrderStatus } from '../services/orders';
import { ORDER_STATUSES } from '../data/seed';
import { inr, fmtDate } from '../lib/format';

const STAT = ORDER_STATUSES;

export function AdminOrders() {
  const [orders] = useRepo('orders');
  const nav = useNavigate();
  const [f, setF] = useState('');
  const rows = orders.filter((o) => !f || o.orderStatus === f).map((o) => ({ ...o, customer: o.customerName || o.shippingAddress?.name, itemCount: o.items.reduce((s, i) => s + i.qty, 0) }));
  return (
    <>
      <PageHead title="Orders" actions={<label className="afilter"><span className="sr">Filter by status</span><select value={f} onChange={(e) => setF(e.target.value)}><option value="">All statuses</option>{STAT.map((s) => <option key={s}>{s}</option>)}</select></label>} />
      <DataTable rows={rows} searchKeys={['id', 'customer']} onRow={(o) => nav(`/admin/orders/${o.id}`)}
        columns={[{ key: 'id', label: 'Order ID' }, { key: 'customer', label: 'Customer' }, { key: 'createdAt', label: 'Date', render: (o) => fmtDate(o.createdAt) }, { key: 'itemCount', label: 'Items', num: true }, { key: 'total', label: 'Total', num: true, render: (o) => inr(o.total) }, { key: 'paymentStatus', label: 'Payment', render: (o) => <Pill tone={o.paymentStatus}>{o.paymentStatus}</Pill> }, { key: 'orderStatus', label: 'Status', render: (o) => <Pill tone={o.orderStatus}>{o.orderStatus}</Pill> }]} />
    </>
  );
}

export function AdminOrderDetail() {
  const { id } = useParams();
  const [orders] = useRepo('orders');
  const { toast } = useStore();
  const o = orders.find((x) => x.id === id);
  const [note, setNote] = useState(null);
  if (!o) return <><PageHead title="Order not found" /><Link to="/admin/orders" className="link">Back to orders</Link></>;
  const a = o.shippingAddress || {};
  const changeStatus = async (s) => {
    if (s === o.orderStatus) return;
    if (s === 'Cancelled' && !window.confirm('Cancel this order?')) return;
    await setOrderStatus(o, s);
    if (s === 'Cancelled' || s === 'Delivered') {
      for (const it of o.items) { const p = await repo('products').get(it.productId); if (p) await repo('products').update(p.id, s === 'Delivered' ? { stock: Math.max(0, p.stock - it.qty), reserved: Math.max(0, (p.reserved || 0) - it.qty) } : { reserved: Math.max(0, (p.reserved || 0) - it.qty) }); }
    }
    toast(`Order marked ${s}.`);
  };
  return (
    <>
      <Link to="/admin/orders" className="link">All orders</Link>
      <PageHead title={`Order ${o.id}`} sub={`Placed ${fmtDate(o.createdAt)}`} actions={<Sel label="Order status" value={o.orderStatus} onChange={changeStatus} options={STAT} />} />
      <div className="agrid">
        <section className="acard"><h2>Customer</h2><p><b>{a.name || o.customerName}</b></p><p>{a.phone}</p>{a.email && <p>{a.email}</p>}
          <h2 className="mt">Shipping address</h2><address>{[a.line1, a.street, a.area].filter(Boolean).join(', ')}<br />{[a.city, a.district].filter(Boolean).join(', ')}, {a.state} {a.pin}</address></section>
        <section className="acard"><h2>Payment</h2><p>{o.paymentMethod?.toUpperCase()} <Pill tone={o.paymentStatus}>{o.paymentStatus}</Pill></p>
          <dl className="adl"><div><dt>Subtotal</dt><dd>{inr(o.subtotal)}</dd></div><div><dt>Discount</dt><dd>−{inr(o.discount)}</dd></div><div><dt>Shipping</dt><dd>{inr(o.shipping)}</dd></div><div><dt>Tax (included)</dt><dd>{inr(o.tax)}</dd></div><div className="total"><dt>Grand total</dt><dd>{inr(o.total)}</dd></div></dl>
          <Sel label="Payment status" value={o.paymentStatus} onChange={(v) => repo('orders').update(o.id, { paymentStatus: v })} options={['Pending', 'Paid', 'Failed', 'Refunded', 'Void']} /></section>
      </div>
      <section className="acard"><h2>Products</h2>
        <table className="atable"><thead><tr><th>Product</th><th className="num">Qty</th><th className="num">Price</th><th className="num">Subtotal</th></tr></thead>
          <tbody>{o.items.map((i) => <tr key={i.productId}><td><span className="pcell"><span className="pcell__img"><ProductImage image={i.image} product={{ name: i.name, shape: 'side' }} /></span><span><b>{i.name}</b><small>{i.sku}</small></span></span></td><td className="num">{i.qty}</td><td className="num">{inr(i.price)}</td><td className="num">{inr(i.price * i.qty)}</td></tr>)}</tbody></table></section>
      <div className="agrid">
        <section className="acard"><h2>Timeline</h2><ol className="atl">{(o.timeline || []).map((t, i) => <li key={i}><b>{t.status}</b><span>{fmtDate(t.at, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</span></li>)}</ol></section>
        <section className="acard"><h2>Admin notes</h2><textarea className="anote" rows={5} value={note ?? o.notes ?? ''} onChange={(e) => setNote(e.target.value)} />
          <button className="btn btn--gold btn--sm" onClick={async () => { await repo('orders').update(o.id, { notes: note ?? '' }); toast('Note saved.'); }}>Save note</button></section>
      </div>
    </>
  );
}
