import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Phone, MapPin, MessageCircle, Mail, Sparkles, Tag } from 'lucide-react';
import SEO from '../components/SEO';
import Countdown from '../components/Countdown';
import { ProductGrid } from '../components/ProductCard';
import { Empty } from '../components/Bits';
import { useStore } from '../store/StoreContext';
import { useRepo, repo } from '../services/db';
import { whatsappUrl, fmtDate } from '../lib/format';
import { isOfferLive } from '../lib/pricing';
import { FurnitureArt } from '../components/FurnitureArt';

/* ---------- About ---------- */
const PROCESS = [
  ['Wood', 'Choosing teak boards with the right grain and colour for the piece.'],
  ['Design', 'Shaping proportions and details so the piece works in a real home.'],
  ['Craft', 'Cutting and joining the wood into a strong frame.'],
  ['Finish', 'Sanding and finishing to bring out the natural grain.'],
  ['Home', 'Quality checks, careful packing and delivery to your door.'],
];
export function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] });
  const line = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <>
      <SEO title="About Us: Crafting Spaces With Character" description="The story of Hi Grove Furnitures, Tirunelveli: natural teak, thoughtful design and furniture made for everyday living." />
      <header className="pagehead pagehead--dark grain-bg"><div className="wrap"><h1 className="display">CRAFTING SPACES WITH CHARACTER.</h1><p>Hi Grove Furnitures is a teak wood furniture brand from Tirunelveli, Tamil Nadu.</p></div></header>
      <div className="wrap prose section">
        <h2 className="h2">Our philosophy</h2>
        <p>Natural materials, thoughtful design and functional living. We believe furniture should feel warm to the touch, sit comfortably in daily life and stay good-looking for years.</p>
        <h2 className="h2">Our approach</h2>
        <ul className="approach">
          {[['Material selection', 'We start with teak and choose boards for grain and colour.'], ['Design', 'Clean lines and proportions that suit Indian homes.'], ['Craftsmanship', 'Solid joinery, cut and assembled with care.'], ['Finishing', 'A finish that shows the grain and protects the wood.'], ['Quality checks', 'Every piece is inspected before it leaves us.'], ['Packaging', 'Packed to arrive in the condition it left us.']].map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}
        </ul>
        <h2 className="h2">Our promise</h2>
        <p>We will describe every piece honestly, tell you clearly what it is made of and help you when you need us. Call or WhatsApp us on 9087000717.</p>
      </div>
      <section className="process grain-bg" ref={ref} aria-labelledby="pr-h">
        <div className="wrap"><h2 id="pr-h" className="display">FROM WOOD TO HOME</h2>
          <div className="process__track"><motion.i style={{ scaleX: line }} /></div>
          <ol className="process__steps">
            {PROCESS.map(([t, d], i) => (
              <motion.li key={t} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.08, duration: 0.6 }}>
                <span className="process__n">{i + 1}</span><h3>{t.toUpperCase()}</h3><p>{d}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

/* ---------- Offers ---------- */
const SECTIONS = [['limited', 'Limited time offers'], ['new', 'New collection'], ['clearance', 'Clearance'], ['bundle', 'Bundle offers']];
export function Offers() {
  const { offers, products, catById } = useStore();
  const live = offers.filter((o) => isOfferLive(o));
  const scope = (o) => (o.type === 'category' ? catById[o.categoryId]?.name : o.type === 'percentage' || o.type === 'flat' ? 'Everything' : null);
  return (
    <>
      <SEO title="Offers on Teak Furniture" description="Current offers, new collection launches, clearance and bundle deals at Hi Grove Furnitures." />
      <header className="pagehead pagehead--dark grain-bg"><div className="wrap"><h1 className="display">OFFERS</h1><p>Current offers on teak furniture.</p></div></header>
      <div className="wrap section--tight">
        {!live.length && <Empty icon={Tag} title="NO OFFERS RIGHT NOW." text="Check back soon, or explore the full collection." />}
        {SECTIONS.map(([k, label]) => {
          const list = live.filter((o) => o.placement === k);
          if (!list.length) return null;
          return (
            <section key={k} className="offersec" aria-labelledby={`o-${k}`}>
              <h2 id={`o-${k}`} className="h2">{label}</h2>
              {list.map((o) => {
                const items = (o.products || []).map((id) => products.find((p) => p.id === id)).filter(Boolean);
                const cat = o.type === 'category' ? products.filter((p) => p.categoryId === o.categoryId) : [];
                return (
                  <div key={o.id} className="offer">
                    <div className="offer__head">
                      <div><h3>{o.name}</h3><p>{o.description}</p>{scope(o) && <p className="muted small">Applies to: {scope(o)}</p>}{o.endDate && <p className="muted small">Ends {fmtDate(o.endDate)}</p>}</div>
                      <div className="offer__amt">{o.discountKind === 'flat' ? `₹${o.discount} off` : `${o.discount}% off`}</div>
                    </div>
                    {o.endDate && <Countdown end={o.endDate} />}
                    {(items.length > 0 || cat.length > 0) && <ProductGrid items={(items.length ? items : cat).slice(0, 4)} />}
                    {o.type === 'bundle' && <p className="small muted">Add all the pieces above to your cart and the bundle discount applies automatically.</p>}
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>
    </>
  );
}

/* ---------- FAQ ---------- */
export function FAQ() {
  const [faqs] = useRepo('faqs');
  const [open, setOpen] = useState(0);
  const list = [...faqs].sort((a, b) => (a.order || 0) - (b.order || 0));
  return (
    <>
      <SEO title="Frequently Asked Questions" description="Answers about teak furniture care, delivery, payments, orders, cancellations and returns at Hi Grove Furnitures."
        jsonLd={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: list.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} />
      <header className="pagehead pagehead--dark grain-bg"><div className="wrap"><h1 className="display">FREQUENTLY ASKED QUESTIONS</h1></div></header>
      <div className="wrap wrap--narrow section--tight">
        {list.map((f, i) => (
          <div key={f.id} className={`acc acc--faq ${open === i ? 'is-open' : ''}`}>
            <h2><button className="acc__btn" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>{f.q}<ChevronDown size={18} /></button></h2>
            {open === i && <div className="acc__body"><p>{f.a}</p></div>}
          </div>
        ))}
        <p className="muted center">Still have a question? <Link to="/contact" className="link">Contact us</Link></p>
      </div>
    </>
  );
}

/* ---------- Contact ---------- */
export function Contact() {
  const { settings, toast } = useStore();
  const s = settings.store;
  const [f, setF] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [done, setDone] = useState(false);
  const [err, setErr] = useState({});
  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = 'Enter your name.';
    if (!/^[6-9]\d{9}$/.test(f.phone)) er.phone = 'Enter a 10-digit mobile number.';
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email address.';
    if (f.message.trim().length < 5) er.message = 'Tell us how we can help.';
    setErr(er); if (Object.keys(er).length) return;
    await repo('messages').create({ ...f, status: 'New' });
    setDone(true); setF({ name: '', phone: '', email: '', subject: '', message: '' }); toast('Message sent.');
  };
  const F = (k, l, p = {}) => <div className={`field ${err[k] ? 'has-err' : ''}`}><label htmlFor={`c-${k}`}>{l}</label><input id={`c-${k}`} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} {...p} />{err[k] && <p className="error small">{err[k]}</p>}</div>;
  return (
    <>
      <SEO title="Contact Us" description="Contact Hi Grove Furnitures, Tirunelveli 627451. Call 9087000717 or send us a message." jsonLd={{ '@context': 'https://schema.org', '@type': 'FurnitureStore', name: s.name, telephone: s.phone, address: { '@type': 'PostalAddress', addressLocality: 'Tirunelveli', postalCode: '627451', addressRegion: 'Tamil Nadu', addressCountry: 'IN' } }} />
      <header className="pagehead pagehead--dark grain-bg"><div className="wrap"><h1 className="display">CONTACT</h1><p>We are happy to help with products, orders and custom requests.</p></div></header>
      <div className="wrap contact section--tight">
        <form className="panel" onSubmit={submit} noValidate>
          {done && <p className="notice notice--ok" role="status">Thank you. We have your message and will get back to you.</p>}
          {F('name', 'Name', { autoComplete: 'name' })}{F('phone', 'Phone', { inputMode: 'numeric', maxLength: 10, autoComplete: 'tel-national' })}{F('email', 'Email (optional)', { type: 'email' })}{F('subject', 'Subject')}
          <div className={`field ${err.message ? 'has-err' : ''}`}><label htmlFor="c-message">Message</label><textarea id="c-message" rows={5} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />{err.message && <p className="error small">{err.message}</p>}</div>
          <button className="btn btn--gold">SEND MESSAGE</button>
        </form>
        <aside className="contact__card grain-bg">
          <h2 className="display display--sm">{s.name}</h2>
          <p className="ftr__line"><Phone size={16} /><a href={`tel:${s.phone}`}>{s.phone}</a></p>
          {s.email && <p className="ftr__line"><Mail size={16} /><a href={`mailto:${s.email}`}>{s.email}</a></p>}
          <p className="ftr__line"><MapPin size={16} />{s.address}</p>
          <a className="btn btn--wa" href={whatsappUrl('Hello Hi Grove Furnitures, I have a question.')} target="_blank" rel="noreferrer"><MessageCircle size={16} />WhatsApp Us</a>
        </aside>
      </div>
    </>
  );
}
