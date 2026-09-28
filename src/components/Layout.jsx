import { useEffect, useState, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, Home, Store as StoreIcon, MessageCircle, Phone, MapPin, Mail } from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { useStore } from '../store/StoreContext';
import { Brand, Toasts } from './Bits';
import QuickView from './QuickView';
import { whatsappUrl } from '../lib/format';

function Header() {
  const { categories, cartCount, wish } = useStore();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [solid, setSolid] = useState(false);
  const { pathname } = useLocation();
  const nav = useNavigate();
  const t = useRef();
  useEffect(() => { setOpen(false); setMega(false); }, [pathname]);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const overlay = pathname === '/' && !solid;
  return (
    <header className={`hdr ${overlay ? 'hdr--clear' : ''}`}>
      <div className="hdr__in">
        <button className="icon-btn hdr__menu" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
        <Link to="/" className="hdr__brand" aria-label="Hi Grove Furnitures, home"><Brand tone="light" /></Link>
        <nav className="hdr__nav" aria-label="Primary">
          <div className="hdr__shop" onMouseEnter={() => { clearTimeout(t.current); setMega(true); }} onMouseLeave={() => { t.current = setTimeout(() => setMega(false), 120); }}>
            <NavLink to="/shop" className="hdr__link" onFocus={() => setMega(true)}>Shop</NavLink>
            <AnimatePresence>
              {mega && (
                <motion.div className="mega" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.18 }}>
                  {categories.map((c) => (
                    <div key={c.id} className="mega__col">
                      <Link to={`/category/${c.slug}`} className="mega__head">{c.name}</Link>
                      {c.subcategories.map((s) => <Link key={s} to={`/category/${c.slug}?sub=${encodeURIComponent(s)}`}>{s}</Link>)}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <NavLink to="/offers" className="hdr__link">Offers</NavLink>
          <NavLink to="/about" className="hdr__link">Our craft</NavLink>
          <NavLink to="/faq" className="hdr__link">FAQ</NavLink>
          <NavLink to="/contact" className="hdr__link">Contact</NavLink>
        </nav>
        <div className="hdr__tools">
          <button className="icon-btn" aria-label="Search" onClick={() => nav('/search')} data-cursor="OPEN"><Search size={20} /></button>
          <Link className="icon-btn hdr__hide-sm" to="/wishlist" aria-label={`Wishlist, ${wish.length} items`}><Heart size={20} />{wish.length > 0 && <b className="count">{wish.length}</b>}</Link>
          <Link className="icon-btn" to="/cart" aria-label={`Cart, ${cartCount} items`}><ShoppingBag size={20} />{cartCount > 0 && <b className="count">{cartCount}</b>}</Link>
          <Link className="icon-btn hdr__hide-sm" to="/account" aria-label="Account"><User size={20} /></Link>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="drawer" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} role="dialog" aria-modal="true" aria-label="Menu">
            <div className="drawer__top"><Brand tone="light" /><button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close menu"><X size={22} /></button></div>
            <nav className="drawer__nav">
              <Link to="/shop">All furniture</Link>
              {categories.map((c) => <Link key={c.id} to={`/category/${c.slug}`} className="drawer__sub">{c.name}</Link>)}
              <Link to="/offers">Offers</Link><Link to="/about">Our craft</Link><Link to="/faq">FAQ</Link><Link to="/contact">Contact</Link><Link to="/orders">My orders</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileNav() {
  const { cartCount, wish } = useStore();
  const items = [
    ['/', 'Home', Home], ['/shop', 'Shop', StoreIcon], ['/wishlist', 'Wishlist', Heart, wish.length], ['/cart', 'Cart', ShoppingBag, cartCount], ['/account', 'Account', User],
  ];
  return (
    <nav className="mnav" aria-label="Mobile">
      {items.map(([to, label, Icon, n]) => (
        <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'is-on' : '')}>
          <span className="mnav__ic"><Icon size={21} />{n > 0 && <b className="count">{n}</b>}</span>{label}
        </NavLink>
      ))}
    </nav>
  );
}

function Footer() {
  const { settings, categories } = useStore();
  const s = settings.store;
  return (
    <footer className="ftr grain-bg">
      <div className="ftr__in">
        <div className="ftr__brand">
          <img src="/brand/logo-full-sm.webp" alt="Hi Grove Furnitures logo" width="220" height="173" loading="lazy" />
          <p>Premium teak wood furniture from Tirunelveli, made for Indian homes.</p>
        </div>
        <div><h3>Shop</h3>{categories.map((c) => <Link key={c.id} to={`/category/${c.slug}`}>{c.name}</Link>)}<Link to="/offers">Offers</Link></div>
        <div><h3>Help</h3><Link to="/faq">FAQ</Link><Link to="/orders">Track an order</Link><Link to="/contact">Contact us</Link><Link to="/about">Our craft</Link></div>
        <div>
          <h3>Visit &amp; call</h3>
          <p className="ftr__line"><Phone size={15} /><a href={`tel:${s.phone}`}>{s.phone}</a></p>
          {s.email && <p className="ftr__line"><Mail size={15} /><a href={`mailto:${s.email}`}>{s.email}</a></p>}
          <p className="ftr__line"><MapPin size={15} />{s.address}</p>
          <a className="btn btn--wa" href={whatsappUrl('Hello Hi Grove Furnitures, I would like to know more about your furniture.')} target="_blank" rel="noreferrer"><MessageCircle size={16} />WhatsApp us</a>
        </div>
      </div>
      <div className="ftr__legal">© {new Date().getFullYear()} {s.name}. All rights reserved.</div>
    </footer>
  );
}

/** Desktop-only wood/gold cursor. Labels come from data-cursor; buttons and links default to OPEN. */
function Cursor() {
  const [on, setOn] = useState(false);
  const [label, setLabel] = useState('');
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40 }), sy = useSpring(y, { stiffness: 500, damping: 40 });
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setOn(true);
    document.documentElement.classList.add('has-cursor');
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e) => {
      const el = e.target.closest?.('[data-cursor], a, button, [role=button], input, select, textarea, label');
      if (!el) return setLabel('');
      if (el.dataset?.cursor) return setLabel(el.dataset.cursor);
      setLabel(/^(INPUT|SELECT|TEXTAREA|LABEL)$/.test(el.tagName) ? '' : 'OPEN');
    };
    window.addEventListener('pointermove', move); document.addEventListener('pointerover', over);
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerover', over); document.documentElement.classList.remove('has-cursor'); };
  }, [x, y]);
  if (!on) return null;
  return (
    <motion.div className={`cursor ${label ? 'is-label' : ''}`} style={{ x: sx, y: sy }} aria-hidden="true">
      <span>{label}</span>
    </motion.div>
  );
}

export default function Layout() {
  const { toasts } = useStore();
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) { setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 80); return; }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main id="main" key={pathname} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <MobileNav />
      <QuickView />
      <Toasts items={toasts} />
      <Cursor />
    </>
  );
}
