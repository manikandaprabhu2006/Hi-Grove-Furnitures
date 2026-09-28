import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRepo } from '../services/db';
import { PageHead, LineChart, BarChart, Pill } from './ui';
import { inr, fmtDate } from '../lib/format';
import { stockState } from '../lib/pricing';

const RANGES = [['7', '7 Days', 7], ['30', '30 Days', 30], ['90', '3 Months', 90], ['365', '1 Year', 365]];

export default function Dashboard() {
  const [orders] = useRepo('orders');
  const [products] = useRepo('products');
  const [users] = useRepo('users');
  const [range, setRange] = useState('30');
  const days = +range;
  const valid = useMemo(() => orders.filter((o) => o.orderStatus !== 'Cancelled'), [orders]);
  const low = products.filter((p) => stockState(p) !== 'in').length;

  const series = useMemo(() => {
    const end = Date.now(); const start = end - days * 864e5;
    const inR = valid.filter((o) => new Date(o.createdAt).getTime() >= start);
    const bucketDays = days <= 30 ? 1 : days <= 90 ? 7 : 30;
    const n = Math.ceil(days / bucketDays);
    const b = Array.from({ length: n }, (_, i) => { const d = new Date(start + i * bucketDays * 864e5); return { l: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), rev: 0, orders: 0 }; });
    inR.forEach((o) => { const i = Math.min(n - 1, Math.floor((new Date(o.createdAt).getTime() - start) / (bucketDays * 864e5))); b[i].rev += o.total; b[i].orders += 1; });
    const perf = {};
    inR.forEach((o) => o.items.forEach((it) => { const x = (perf[it.name] ||= 0); perf[it.name] = x + it.price * it.qty; }));
    const rev = inR.reduce((s, o) => s + o.total, 0);
    return { b, rev, count: inR.length, aov: inR.length ? rev / inR.length : 0, perf: Object.entries(perf).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([l, v]) => ({ l, v })) };
  }, [valid, days]);

  const totalSales = valid.reduce((s, o) => s + o.total, 0);
  const cards = [['Total sales', inr(totalSales)], ['Orders', orders.length], ['Products', products.length], ['Customers', users.filter((u) => u.role === 'customer' && (u.demo || orders.some((o) => o.userId === u.id))).length], ['Low stock', low]];
  const recent = orders.slice(0, 6);
  return (
    <>
      <PageHead title="Dashboard" sub="Figures are calculated from the orders, products and customers stored in this browser." />
      <div className="astats">{cards.map(([l, v]) => <div key={l} className="acard astat"><span>{l}</span><b>{v}</b></div>)}</div>
      <div className="arange" role="group" aria-label="Date range">{RANGES.map(([k, l]) => <button key={k} className={range === k ? 'is-on' : ''} onClick={() => setRange(k)}>{l}</button>)}</div>
      <div className="agrid">
        <section className="acard"><h2>Revenue</h2><p className="abig">{inr(series.rev)}</p><LineChart data={series.b.map((x) => ({ l: x.l, v: x.rev }))} format={(v) => (v >= 1e5 ? `${(v / 1e5).toFixed(1)}L` : v >= 1e3 ? `${Math.round(v / 1e3)}k` : Math.round(v))} /></section>
        <section className="acard"><h2>Orders</h2><p className="abig">{series.count}</p><BarChart data={series.b.map((x) => ({ l: x.l, v: x.orders }))} format={(v) => (Number.isInteger(v) ? v : '')} /></section>
        <section className="acard"><h2>Average order value</h2><p className="abig">{inr(series.aov)}</p><p className="amuted">Revenue divided by orders in this period, excluding cancelled orders.</p></section>
        <section className="acard"><h2>Product performance</h2><BarChart horizontal data={series.perf} format={inr} /></section>
      </div>
      <section className="acard"><div className="arow"><h2>Recent orders</h2><Link to="/admin/orders" className="link">View all</Link></div>
        <table className="atable"><tbody>{recent.map((o) => <tr key={o.id}><td><Link to={`/admin/orders/${o.id}`}>{o.id}</Link></td><td>{o.customerName || o.shippingAddress?.name}</td><td>{fmtDate(o.createdAt)}</td><td className="num">{inr(o.total)}</td><td><Pill tone={o.orderStatus}>{o.orderStatus}</Pill></td></tr>)}</tbody></table></section>
    </>
  );
}
