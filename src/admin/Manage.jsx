import { useRef, useState } from 'react';
import { Plus, Trash2, UploadCloud } from 'lucide-react';
import Resource from './Resource';
import { Inp, Txt, Sel, Tog, Pill, Field, PageHead, DataTable } from './ui';
import { useRepo, repo, single, resetDemoData } from '../services/db';
import { useStore } from '../store/StoreContext';
import { fileToImage } from './imageUtil';
import ProductImage from '../components/ProductImage';
import { slugify, uid, fmtDate, inr } from '../lib/format';

function ProductPicker({ label, value = [], onChange }) {
  const [products] = useRepo('products');
  const [q, setQ] = useState('');
  const list = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <Field label={label} wide>
      <input placeholder="Filter products" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="picker">{list.map((p) => (
        <label key={p.id} className="atog"><input type="checkbox" checked={value.includes(p.id)} onChange={() => onChange(value.includes(p.id) ? value.filter((x) => x !== p.id) : [...value, p.id])} /><span>{p.name}</span></label>
      ))}</div>
      <small>{value.length} selected</small>
    </Field>
  );
}

function ImageField({ label, value, onChange }) {
  const ref = useRef(null);
  const [msg, setMsg] = useState('');
  return (
    <Field label={label} wide>
      <div className="row">
        {value && (typeof value === 'string' ? <img className="imgpre" src={value} alt="" /> : value.kind !== 'art' ? <img className="imgpre" src={value.src} alt="" /> : <span className="imgpre"><ProductImage image={value} product={{ name: '', shape: value.shape }} /></span>)}
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => ref.current.click()}><UploadCloud size={14} />Upload image</button>
        {value && <button type="button" className="link link--danger" onClick={() => onChange('')}>Remove</button>}
        <input ref={ref} type="file" accept="image/*" hidden onChange={async (e) => { try { const f = e.target.files[0]; if (f) onChange(await fileToImage(f, 1400)); setMsg(''); } catch (x) { setMsg(x.message); } e.target.value = ''; }} />
      </div>{msg && <p className="error">{msg}</p>}
    </Field>
  );
}

export const Categories = () => (
  <Resource name="categories" title="Categories" addLabel="Add category" searchKeys
    blank={() => ({ id: uid('cat'), name: '', slug: '', tagline: '', description: '', image: '', subcategories: [], status: 'active' })}
    validate={(c, rows) => (!c.name.trim() ? 'Enter a category name.' : rows.some((r) => r.slug === (c.slug || slugify(c.name)) && r.id !== c.id) ? 'Another category already uses this URL name.' : '')}
    columns={[{ key: 'name', label: 'Name' }, { key: 'slug', label: 'URL' }, { key: 'subcategories', label: 'Subcategories', render: (c) => c.subcategories?.length || 0 }, { key: 'status', label: 'Status', render: (c) => <Pill tone={c.status}>{c.status}</Pill> }]}
    form={(c, set, setAll) => (<>
      <Inp label="Name" value={c.name} onChange={(v) => setAll({ ...c, name: v, slug: slugify(v) })} />
      <Inp label="URL name" value={c.slug} onChange={set('slug')} />
      <Inp label="Tagline" value={c.tagline} onChange={set('tagline')} wide />
      <Txt label="Description" value={c.description} onChange={set('description')} rows={3} />
      <Inp label="Subcategories (comma separated)" value={(c.subcategories || []).join(', ')} onChange={(v) => set('subcategories')(v.split(',').map((s) => s.trim()).filter(Boolean))} wide />
      <ImageField label="Category image" value={c.image?.kind === 'art' ? c.image : c.image} onChange={set('image')} />
      <Sel label="Status" value={c.status} onChange={set('status')} options={['active', 'hidden']} />
    </>)} />
);

export const Offers = () => {
  const [cats] = useRepo('categories');
  return (
    <Resource name="offers" title="Offers" addLabel="Add offer" wide sub="Offers apply automatically in the cart while they are active and between their start and end dates."
      blank={() => ({ id: uid('off'), name: '', description: '', type: 'percentage', discountKind: 'percent', discount: 10, products: [], categoryId: '', startDate: '', endDate: '', status: 'draft', placement: 'limited' })}
      validate={(o) => (!o.name.trim() ? 'Enter an offer name.' : !(o.discount > 0) ? 'Enter a discount above zero.' : o.discountKind === 'percent' && o.discount > 90 ? 'Percentage discount cannot exceed 90.' : o.startDate && o.endDate && o.endDate < o.startDate ? 'End date must be after the start date.' : o.type === 'category' && !o.categoryId ? 'Choose a category.' : (o.type === 'product' || o.type === 'bundle') && !o.products.length ? 'Choose at least one product.' : '')}
      columns={[{ key: 'name', label: 'Offer' }, { key: 'type', label: 'Type' }, { key: 'discount', label: 'Discount', render: (o) => (o.discountKind === 'flat' ? inr(o.discount) : `${o.discount}%`) }, { key: 'endDate', label: 'Ends', render: (o) => fmtDate(o.endDate) || 'No end date' }, { key: 'status', label: 'Status', render: (o) => <Pill tone={o.status}>{o.status}</Pill> }]}
      form={(o, set) => (<>
        <Inp label="Offer name" value={o.name} onChange={set('name')} /><Inp label="Description" value={o.description} onChange={set('description')} />
        <Sel label="Offer type" value={o.type} onChange={set('type')} options={[['percentage', 'Percentage, all products'], ['flat', 'Flat amount, all products'], ['product', 'Product-specific'], ['category', 'Category'], ['bundle', 'Bundle']]} />
        <Sel label="Discount kind" value={o.discountKind} onChange={set('discountKind')} options={[['percent', 'Percent'], ['flat', 'Flat ₹']]} />
        <Inp label="Discount" type="number" min="0" value={o.discount} onChange={set('discount')} />
        <Sel label="Show on offers page under" value={o.placement} onChange={set('placement')} options={[['limited', 'Limited time offers'], ['new', 'New collection'], ['clearance', 'Clearance'], ['bundle', 'Bundle offers']]} />
        <Inp label="Start date" type="date" value={o.startDate} onChange={set('startDate')} /><Inp label="End date" type="date" value={o.endDate} onChange={set('endDate')} hint="Leave empty for no end. A countdown shows only when an end date is set." />
        {o.type === 'category' && <Sel label="Category" value={o.categoryId} onChange={set('categoryId')} options={[['', 'Choose…'], ...cats.map((c) => [c.id, c.name])]} />}
        {(o.type === 'product' || o.type === 'bundle') && <ProductPicker label="Applicable products" value={o.products} onChange={set('products')} />}
        <Sel label="Status" value={o.status} onChange={set('status')} options={['active', 'draft']} />
      </>)} />
  );
};

export const Coupons = () => (
  <Resource name="coupons" title="Coupons" addLabel="Add coupon"
    blank={() => ({ id: uid('cp'), code: '', type: 'percent', value: 5, minimumOrder: 0, maximumDiscount: 0, usageLimit: 0, usedCount: 0, startDate: '', endDate: '', status: 'active' })}
    validate={(c, rows) => (!/^[A-Z0-9]{3,20}$/.test(c.code) ? 'Use 3 to 20 capital letters or numbers for the code.' : rows.some((r) => r.code === c.code && r.id !== c.id) ? 'This code already exists.' : !(c.value > 0) ? 'Enter a discount value.' : c.type === 'percent' && c.value > 90 ? 'Percentage cannot exceed 90.' : c.startDate && c.endDate && c.endDate < c.startDate ? 'End date must be after start date.' : '')}
    columns={[{ key: 'code', label: 'Code' }, { key: 'value', label: 'Discount', render: (c) => (c.type === 'flat' ? inr(c.value) : `${c.value}%`) }, { key: 'minimumOrder', label: 'Min order', num: true, render: (c) => inr(c.minimumOrder) }, { key: 'usedCount', label: 'Used', num: true, render: (c) => `${c.usedCount || 0}${c.usageLimit ? ` / ${c.usageLimit}` : ''}` }, { key: 'status', label: 'Status', render: (c) => <Pill tone={c.status}>{c.status}</Pill> }]}
    form={(c, set) => (<>
      <Inp label="Coupon code" value={c.code} onChange={(v) => set('code')(v.toUpperCase().replace(/[^A-Z0-9]/g, ''))} />
      <Sel label="Discount type" value={c.type} onChange={set('type')} options={[['percent', 'Percent'], ['flat', 'Flat ₹']]} />
      <Inp label="Discount value" type="number" min="0" value={c.value} onChange={set('value')} /><Inp label="Minimum order (₹)" type="number" min="0" value={c.minimumOrder} onChange={set('minimumOrder')} />
      <Inp label="Maximum discount (₹)" type="number" min="0" value={c.maximumDiscount} onChange={set('maximumDiscount')} hint="0 means no cap." /><Inp label="Usage limit" type="number" min="0" value={c.usageLimit} onChange={set('usageLimit')} hint="0 means unlimited." />
      <Inp label="Start date" type="date" value={c.startDate} onChange={set('startDate')} /><Inp label="End date" type="date" value={c.endDate} onChange={set('endDate')} />
      <Sel label="Status" value={c.status} onChange={set('status')} options={['active', 'inactive']} />
    </>)} />
);

export const Banners = () => (
  <Resource name="banners" title="Banners" addLabel="Add banner" sub="Promotional banners shown on the homepage."
    blank={() => ({ id: uid('bn'), title: '', text: '', ctaLabel: 'Shop now', href: '/shop', image: '', placement: 'home-mid', status: 'active' })}
    validate={(b) => (!b.title.trim() ? 'Enter a banner title.' : '')}
    columns={[{ key: 'title', label: 'Title' }, { key: 'placement', label: 'Placement' }, { key: 'status', label: 'Status', render: (b) => <Pill tone={b.status}>{b.status}</Pill> }]}
    form={(b, set) => (<>
      <Inp label="Title" value={b.title} onChange={set('title')} /><Inp label="Text" value={b.text} onChange={set('text')} />
      <Inp label="Button label" value={b.ctaLabel} onChange={set('ctaLabel')} /><Inp label="Link" value={b.href} onChange={set('href')} hint="A path like /shop, or the word whatsapp." />
      <ImageField label="Banner image" value={b.image} onChange={set('image')} /><Sel label="Status" value={b.status} onChange={set('status')} options={['active', 'hidden']} />
    </>)} />
);

export const Collections = () => (
  <Resource name="collections" title="Collections" addLabel="Add collection" sub="Curated product groups. The collection named 'signature' feeds the homepage grid."
    blank={() => ({ id: uid('col'), name: '', slug: '', productIds: [], status: 'active' })}
    validate={(c, rows) => (!c.name.trim() ? 'Enter a collection name.' : rows.some((r) => r.slug === c.slug && r.id !== c.id) ? 'This URL name is already used.' : '')}
    columns={[{ key: 'name', label: 'Name' }, { key: 'slug', label: 'URL name' }, { key: 'productIds', label: 'Products', num: true, render: (c) => c.productIds.length }, { key: 'status', label: 'Status', render: (c) => <Pill tone={c.status}>{c.status}</Pill> }]}
    form={(c, set, setAll) => (<>
      <Inp label="Name" value={c.name} onChange={(v) => setAll({ ...c, name: v, slug: c.slug && c.id.startsWith('col_') && c.slug === slugify(c.name) ? slugify(v) : c.slug || slugify(v) })} /><Inp label="URL name" value={c.slug} onChange={set('slug')} />
      <ProductPicker label="Products" value={c.productIds} onChange={set('productIds')} /><Sel label="Status" value={c.status} onChange={set('status')} options={['active', 'hidden']} />
    </>)} />
);

export function Reviews() {
  const [rows] = useRepo('reviews');
  const [products] = useRepo('products');
  const { toast } = useStore();
  const pn = (id) => products.find((p) => p.id === id)?.name || 'Removed product';
  const set = (id, patch, m) => repo('reviews').update(id, patch).then(() => toast(m));
  const data = rows.map((r) => ({ ...r, product: pn(r.productId) }));
  return (
    <>
      <PageHead title="Reviews" sub="Only approved reviews appear on the store. Reviews marked Sample are placeholders; delete them when you have real ones." />
      <DataTable rows={data} searchKeys={['customer', 'product', 'review']} columns={[
        { key: 'customer', label: 'Customer', render: (r) => <>{r.customer}{r.sample && <em className="tm__tag">Sample</em>}</> }, { key: 'product', label: 'Product' }, { key: 'rating', label: 'Rating', num: true, render: (r) => `${r.rating} / 5` },
        { key: 'review', label: 'Review', render: (r) => <span className="clamp">{r.review}</span> }, { key: 'createdAt', label: 'Date', render: (r) => fmtDate(r.createdAt) }, { key: 'status', label: 'Status', render: (r) => <Pill tone={r.status}>{r.status}</Pill> },
        { key: 'id', label: 'Actions', render: (r) => (<span className="acts">
          {r.status !== 'approved' && <button className="link" onClick={() => set(r.id, { status: 'approved' }, 'Review approved.')}>Approve</button>}
          {r.status === 'approved' && <button className="link" onClick={() => set(r.id, { status: 'hidden' }, 'Review hidden.')}>Hide</button>}
          <button className="link" onClick={() => set(r.id, { featured: !r.featured }, r.featured ? 'Unfeatured.' : 'Featured.')}>{r.featured ? 'Unfeature' : 'Feature'}</button>
          <button className="link link--danger" onClick={() => window.confirm('Delete this review?') && repo('reviews').remove(r.id)}>Delete</button></span>) }]} />
    </>
  );
}

export function Messages() {
  const [rows] = useRepo('messages');
  const [open, setOpen] = useState(null);
  const m = rows.find((r) => r.id === open);
  return (
    <>
      <PageHead title="Contact messages" />
      <DataTable rows={rows} searchKeys={['name', 'subject', 'message', 'phone']} onRow={(r) => { setOpen(r.id); if (r.status === 'New') repo('messages').update(r.id, { status: 'Read' }); }} columns={[
        { key: 'name', label: 'Name' }, { key: 'phone', label: 'Phone' }, { key: 'subject', label: 'Subject' }, { key: 'createdAt', label: 'Date', render: (r) => fmtDate(r.createdAt) }, { key: 'status', label: 'Status', render: (r) => <Pill tone={r.status}>{r.status}</Pill> }]} />
      {m && (
        <div className="acard">
          <h2>{m.subject || 'No subject'}</h2><p className="amuted">{m.name} · {m.phone}{m.email ? ` · ${m.email}` : ''} · {fmtDate(m.createdAt)}</p><p className="pre">{m.message}</p>
          <div className="row"><Sel label="Status" value={m.status} onChange={(v) => repo('messages').update(m.id, { status: v })} options={['New', 'Read', 'Replied', 'Closed']} />
            <a className="btn btn--ghost btn--sm" href={`tel:${m.phone}`}>Call</a>{m.email && <a className="btn btn--ghost btn--sm" href={`mailto:${m.email}`}>Email</a>}
            <button className="btn btn--danger btn--sm" onClick={() => { repo('messages').remove(m.id); setOpen(null); }}>Delete</button></div>
        </div>
      )}
    </>
  );
}

const useSingle = (name) => { const [v] = useRepo(name); return [v, (patch) => single(name).set(patch)]; };

export function Content() {
  const [tab, setTab] = useState('Homepage');
  const [home, setHome] = useSingle('home');
  const [settings, setSettings] = useSingle('settings');
  const [collections] = useRepo('collections');
  const { toast } = useStore();
  const [h, setH] = useState(home);
  const [pol, setPol] = useState(settings.policies || {});
  const save = (fn, m) => async () => { await fn(); toast(m); };
  return (
    <>
      <PageHead title="Content" sub="Homepage, testimonials, FAQs and policy text." />
      <div className="arange">{['Homepage', 'Testimonials', 'FAQs', 'Policies'].map((t) => <button key={t} className={tab === t ? 'is-on' : ''} onClick={() => setTab(t)}>{t}</button>)}</div>
      {tab === 'Homepage' && (
        <div className="acard"><div className="aform">
          <Txt label="Hero heading (one line per row)" value={h.heroHeading} onChange={(v) => setH({ ...h, heroHeading: v })} rows={2} />
          <Txt label="Hero description" value={h.heroText} onChange={(v) => setH({ ...h, heroText: v })} rows={2} />
          <Inp label="Primary button label" value={h.ctaLabel} onChange={(v) => setH({ ...h, ctaLabel: v })} /><Inp label="Primary button link" value={h.ctaHref} onChange={(v) => setH({ ...h, ctaHref: v })} />
          <Inp label="Secondary button label" value={h.cta2Label} onChange={(v) => setH({ ...h, cta2Label: v })} /><Inp label="Secondary button link" value={h.cta2Href} onChange={(v) => setH({ ...h, cta2Href: v })} />
          <ImageField label="Hero image (replaces the illustration)" value={h.heroMedia} onChange={(v) => setH({ ...h, heroMedia: v })} />
          <Sel label="Featured products come from collection" value={h.featuredCollection} onChange={(v) => setH({ ...h, featuredCollection: v })} options={collections.map((c) => [c.slug, c.name])} />
          <Field label="Sections" wide><span className="atogs"><Tog label="Show testimonials" value={h.showTestimonials} onChange={(v) => setH({ ...h, showTestimonials: v })} /></span></Field>
        </div><button className="btn btn--gold btn--sm" onClick={save(() => setHome(h), 'Homepage saved.')}>Save homepage</button></div>
      )}
      {tab === 'Testimonials' && <Testimonials />}
      {tab === 'FAQs' && <Faqs />}
      {tab === 'Policies' && (
        <div className="acard"><p className="amuted">These texts appear on product pages. Leave a field empty to show a "not published yet" message instead of inventing a policy.</p><div className="aform">
          {[['returns', 'Returns policy'], ['warranty', 'Warranty'], ['delivery', 'Delivery information'], ['care', 'Care instructions']].map(([k, l]) => <Txt key={k} label={l} value={pol[k]} onChange={(v) => setPol({ ...pol, [k]: v })} rows={3} />)}
        </div><button className="btn btn--gold btn--sm" onClick={save(() => setSettings({ policies: pol }), 'Policies saved.')}>Save policies</button></div>
      )}
    </>
  );
}

const Testimonials = () => (
  <Resource name="testimonials" title="Testimonials" addLabel="Add testimonial" blank={() => ({ id: uid('t'), name: '', location: '', rating: 5, review: '', product: '', sample: false, status: 'active' })}
    validate={(t) => (!t.name.trim() || !t.review.trim() ? 'Enter a name and a review.' : t.rating < 1 || t.rating > 5 ? 'Rating must be 1 to 5.' : '')}
    columns={[{ key: 'name', label: 'Customer', render: (t) => <>{t.name}{t.sample && <em className="tm__tag">Sample</em>}</> }, { key: 'location', label: 'Location' }, { key: 'rating', label: 'Rating', num: true }, { key: 'status', label: 'Status', render: (t) => <Pill tone={t.status}>{t.status}</Pill> }]}
    form={(t, set) => (<><Inp label="Customer name" value={t.name} onChange={set('name')} /><Inp label="Location" value={t.location} onChange={set('location')} /><Inp label="Product" value={t.product} onChange={set('product')} /><Inp label="Rating (1-5)" type="number" min="1" max="5" value={t.rating} onChange={set('rating')} /><Txt label="Review" value={t.review} onChange={set('review')} rows={4} /><Tog label="This is a sample, not a real review" value={t.sample} onChange={set('sample')} /><Sel label="Status" value={t.status} onChange={set('status')} options={['active', 'hidden']} /></>)} />
);
const Faqs = () => (
  <Resource name="faqs" title="FAQs" addLabel="Add FAQ" blank={() => ({ id: uid('f'), q: '', a: '', order: 99 })} validate={(f) => (!f.q.trim() || !f.a.trim() ? 'Enter a question and an answer.' : '')}
    columns={[{ key: 'order', label: 'Order', num: true }, { key: 'q', label: 'Question' }]}
    form={(f, set) => (<><Inp label="Question" value={f.q} onChange={set('q')} wide /><Txt label="Answer" value={f.a} onChange={set('a')} rows={4} /><Inp label="Order" type="number" value={f.order} onChange={set('order')} /></>)} />
);

export function AdminSettings() {
  const [s, setS] = useSingle('settings');
  const { toast } = useStore();
  const [d, setD] = useState(() => structuredClone(s));
  const up = (path, v) => setD((x) => { const n = structuredClone(x); let o = n; const k = path.split('.'); k.slice(0, -1).forEach((p) => { o = o[p]; }); o[k.at(-1)] = v; return n; });
  const save = async () => {
    if (!d.store.name.trim()) return toast('Enter a store name.', 'warn');
    if (d.tax.rate < 0 || d.tax.rate > 100) return toast('Tax rate must be between 0 and 100.', 'warn');
    await setS(d); toast('Settings saved.');
  };
  return (
    <>
      <PageHead title="Settings" actions={<button className="btn btn--gold btn--sm" onClick={save}>Save settings</button>} />
      <section className="acard"><h2>Store details</h2><div className="aform">
        <Inp label="Store name" value={d.store.name} onChange={(v) => up('store.name', v)} /><Inp label="Phone" value={d.store.phone} onChange={(v) => up('store.phone', v)} /><Inp label="Email" type="email" value={d.store.email} onChange={(v) => up('store.email', v)} /><Inp label="Address" value={d.store.address} onChange={(v) => up('store.address', v)} />
      </div></section>
      <section className="acard"><h2>Shipping</h2><div className="aform">
        <Inp label="Shipping charge (₹)" type="number" min="0" value={d.shipping.charge} onChange={(v) => up('shipping.charge', v)} /><Inp label="Free shipping above (₹)" type="number" min="0" value={d.shipping.freeThreshold} onChange={(v) => up('shipping.freeThreshold', v)} hint="0 turns free shipping off." />
        <Inp label="Delivery regions (comma separated)" value={d.shipping.regions.join(', ')} onChange={(v) => up('shipping.regions', v.split(',').map((x) => x.trim()).filter(Boolean))} wide />
      </div></section>
      <section className="acard"><h2>Tax</h2><div className="aform">
        <Inp label="Tax label" value={d.tax.label} onChange={(v) => up('tax.label', v)} /><Inp label="Tax rate (%)" type="number" min="0" max="100" value={d.tax.rate} onChange={(v) => up('tax.rate', v)} />
        <Tog label="Prices already include tax" value={d.tax.inclusive} onChange={(v) => up('tax.inclusive', v)} />
      </div></section>
      <section className="acard"><h2>Payment methods</h2><p className="amuted">A method is only offered at checkout when switched on. Switch on online methods only after the payment gateway is connected.</p>
        {Object.entries(d.payment).map(([k, m]) => <Tog key={k} label={m.label} value={m.enabled} onChange={(v) => up(`payment.${k}.enabled`, v)} />)}</section>
      <section className="acard"><h2>Notifications</h2>
        {[['orderEmail', 'Email me for new orders'], ['lowStock', 'Alert me about low stock'], ['contactMessages', 'Alert me about contact messages']].map(([k, l]) => <Tog key={k} label={l} value={d.notifications[k]} onChange={(v) => up(`notifications.${k}`, v)} />)}
        <p className="amuted">Notifications need an email service on the backend to be sent.</p></section>
      <section className="acard"><h2>Social links</h2><div className="aform">
        {['instagram', 'facebook', 'youtube'].map((k) => <Inp key={k} label={k[0].toUpperCase() + k.slice(1)} value={d.social[k]} onChange={(v) => up(`social.${k}`, v)} placeholder="https://" />)}
      </div></section>
      <section className="acard"><h2>Demo data</h2><p className="amuted">Reset the demo catalog, orders and settings in this browser to their starting state.</p>
        <button className="btn btn--danger btn--sm" onClick={() => window.confirm('Reset all demo data in this browser?') && resetDemoData()}><Trash2 size={14} />Reset demo data</button></section>
    </>
  );
}
