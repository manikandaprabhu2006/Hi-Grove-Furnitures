import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Package, MapPin } from 'lucide-react';
import SEO from '../components/SEO';
import ProductImage from '../components/ProductImage';
import { OrdersList } from './Orders';
import { useRepo, repo } from '../services/db';
import { useStore } from '../store/StoreContext';
import { uid, inr } from '../lib/format';

const TABS = ['Overview', 'My orders', 'Profile', 'Addresses', 'Wishlist', 'Settings'];
const ID = 'u_demo';

export default function Account() {
  const [users] = useRepo('users');
  const [orders] = useRepo('orders');
  const { wishlist, toggleWish, toast } = useStore();
  const [tab, setTab] = useState('Overview');
  const me = users.find((u) => u.id === ID) || { addresses: [], notifications: {} };
  const mine = orders.filter((o) => o.userId === ID);
  const [prof, setProf] = useState({ name: me.name || '', email: me.email || '', phone: me.phone || '' });
  const [addr, setAddr] = useState(null);
  const save = (patch) => repo('users').update(ID, patch).then(() => toast('Saved.'));

  const saveAddr = (e) => {
    e.preventDefault();
    const list = addr.id ? me.addresses.map((a) => (a.id === addr.id ? addr : a)) : [...me.addresses, { ...addr, id: uid('a') }];
    save({ addresses: list }); setAddr(null);
  };
  const A = (k, l, p = {}) => <div className="field"><label htmlFor={`a-${k}`}>{l}</label><input id={`a-${k}`} value={addr[k] || ''} onChange={(e) => setAddr({ ...addr, [k]: e.target.value })} required {...p} /></div>;

  return (
    <>
      <SEO title="My Account" description="Manage your Hi Grove Furnitures account." noindex />
      <div className="wrap section--tight">
        <h1 className="h1">Account</h1>
        <p className="notice notice--info">Customer sign-in is not connected yet. Your details are saved in this browser only.</p>
        <div className="acct">
          <nav className="acct__nav" aria-label="Account sections">{TABS.map((t) => <button key={t} className={t === tab ? 'is-on' : ''} onClick={() => setTab(t)}>{t}</button>)}</nav>
          <div className="panel">
            {tab === 'Overview' && (
              <div className="stats">
                <div><Package /><b>{mine.length}</b><span>Total orders</span></div>
                <div><Heart /><b>{wishlist.length}</b><span>Wishlist</span></div>
                <div><MapPin /><b>{me.addresses.length}</b><span>Saved addresses</span></div>
              </div>
            )}
            {tab === 'My orders' && <OrdersList embedded />}
            {tab === 'Profile' && (
              <form onSubmit={(e) => { e.preventDefault(); save(prof); }}>
                <h2 className="h3">Profile</h2>
                {['name', 'email', 'phone'].map((k) => <div className="field" key={k}><label htmlFor={`p-${k}`}>{k[0].toUpperCase() + k.slice(1)}</label><input id={`p-${k}`} type={k === 'email' ? 'email' : 'text'} value={prof[k]} onChange={(e) => setProf({ ...prof, [k]: e.target.value })} /></div>)}
                <button className="btn btn--gold">SAVE CHANGES</button>
              </form>
            )}
            {tab === 'Addresses' && (addr ? (
              <form onSubmit={saveAddr}><h2 className="h3">{addr.id ? 'Edit address' : 'Add address'}</h2>
                {A('label', 'Label (Home, Work)')}{A('line1', 'House / Flat')}{A('area', 'Area')}{A('city', 'City')}{A('district', 'District')}{A('state', 'State')}{A('pin', 'PIN code', { pattern: '[1-9][0-9]{5}', inputMode: 'numeric' })}
                <div className="row"><button className="btn btn--gold">SAVE ADDRESS</button><button type="button" className="btn btn--ghost" onClick={() => setAddr(null)}>CANCEL</button></div></form>
            ) : (
              <div><div className="row row--between"><h2 className="h3">Addresses</h2><button className="btn btn--ghost btn--sm" onClick={() => setAddr({ label: 'Home', state: 'Tamil Nadu' })}>ADD ADDRESS</button></div>
                {me.addresses.length ? me.addresses.map((a) => <div key={a.id} className="addr"><div><b>{a.label}</b><p>{[a.line1, a.area, a.city, a.district].filter(Boolean).join(', ')}, {a.state} {a.pin}</p></div><div><button className="link" onClick={() => setAddr(a)}>Edit</button> <button className="link link--danger" onClick={() => save({ addresses: me.addresses.filter((x) => x.id !== a.id) })}>Delete</button></div></div>) : <p className="muted">No saved addresses yet.</p>}</div>
            ))}
            {tab === 'Wishlist' && (wishlist.length ? <ul className="saved">{wishlist.map((p) => <li key={p.id}><div className="line__img"><ProductImage product={p} index={0} /></div><div><Link to={`/product/${p.slug}`}>{p.name}</Link><p>{inr(p.price)}</p><button className="link link--danger" onClick={() => toggleWish(p.id)}>Remove</button></div></li>)}</ul> : <p className="muted">Your wishlist is empty.</p>)}
            {tab === 'Settings' && (
              <div><h2 className="h3">Notifications</h2>
                {[['orders', 'Order updates'], ['offers', 'Offers and new collections']].map(([k, l]) => (
                  <label key={k} className="switch"><input type="checkbox" checked={!!me.notifications?.[k]} onChange={(e) => save({ notifications: { ...me.notifications, [k]: e.target.checked } })} /><span>{l}</span></label>
                ))}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
