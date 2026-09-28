import { Link, useNavigate, useParams } from 'react-router-dom';
import { useRepo, repo } from '../services/db';
import { DataTable, PageHead, Pill, Sel } from './ui';
import { inr, fmtDate } from '../lib/format';

const stats = (u, orders) => { const mine = orders.filter((o) => o.userId === u.id && o.orderStatus !== 'Cancelled'); return { count: mine.length, spent: mine.reduce((s, o) => s + o.total, 0), last: mine[0]?.createdAt }; };

export function Customers() {
  const [users] = useRepo('users');
  const [orders] = useRepo('orders');
  const nav = useNavigate();
  const rows = users.filter((u) => u.role === 'customer').map((u) => ({ ...u, ...(({ count, spent, last }) => ({ count, spent, last }))(stats(u, orders)) }));
  return (
    <>
      <PageHead title="Customers" />
      <DataTable rows={rows} searchKeys={['name', 'email', 'phone']} onRow={(u) => nav(`/admin/customers/${u.id}`)} columns={[
        { key: 'name', label: 'Name', render: (u) => u.name || 'Guest' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' },
        { key: 'count', label: 'Orders', num: true }, { key: 'spent', label: 'Total spent', num: true, render: (u) => inr(u.spent) }, { key: 'last', label: 'Last order', render: (u) => fmtDate(u.last) || '—' },
        { key: 'status', label: 'Status', render: (u) => <Pill tone={u.status}>{u.status}</Pill> }]} />
    </>
  );
}

export function CustomerDetail() {
  const { id } = useParams();
  const [users] = useRepo('users');
  const [orders] = useRepo('orders');
  const u = users.find((x) => x.id === id);
  if (!u) return <><PageHead title="Customer not found" /><Link to="/admin/customers" className="link">Back</Link></>;
  const mine = orders.filter((o) => o.userId === u.id);
  const s = stats(u, orders);
  return (
    <>
      <Link to="/admin/customers" className="link">All customers</Link>
      <PageHead title={u.name || 'Guest customer'} sub={`Customer since ${fmtDate(u.createdAt)}`} actions={<Sel label="Account status" value={u.status} onChange={(v) => repo('users').update(u.id, { status: v })} options={['active', 'blocked']} />} />
      <div className="agrid">
        <section className="acard"><h2>Profile</h2><dl className="adl"><div><dt>Email</dt><dd>{u.email || '—'}</dd></div><div><dt>Phone</dt><dd>{u.phone || '—'}</dd></div><div><dt>Orders</dt><dd>{s.count}</dd></div><div><dt>Total spent</dt><dd>{inr(s.spent)}</dd></div></dl></section>
        <section className="acard"><h2>Addresses</h2>{u.addresses?.length ? u.addresses.map((a) => <p key={a.id}><b>{a.label}</b><br />{[a.line1, a.area, a.city, a.district].filter(Boolean).join(', ')}, {a.state} {a.pin}</p>) : <p className="amuted">No saved addresses.</p>}</section>
      </div>
      <section className="acard"><h2>Orders</h2>{mine.length ? <table className="atable"><tbody>{mine.map((o) => <tr key={o.id}><td><Link to={`/admin/orders/${o.id}`}>{o.id}</Link></td><td>{fmtDate(o.createdAt)}</td><td className="num">{inr(o.total)}</td><td><Pill tone={o.orderStatus}>{o.orderStatus}</Pill></td></tr>)}</tbody></table> : <p className="amuted">No orders yet.</p>}</section>
      <section className="acard"><h2>Wishlist and activity</h2><p className="amuted">Wishlists are stored in each shopper's own browser in demo mode. With a backend, wishlist and activity history will appear here.</p></section>
    </>
  );
}
