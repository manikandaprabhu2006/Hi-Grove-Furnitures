import { useEffect, useState } from 'react';
import { NavLink, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Boxes, Percent, MessageSquareQuote, Ticket, Image, Layers, FileText, Mail, Settings, LogOut, Menu, ExternalLink, AlertTriangle } from 'lucide-react';
import { getSession, signOut } from '../services/auth';
import { useStore } from '../store/StoreContext';
import { Toasts } from '../components/Bits';
import { Brand } from '../components/Bits';

const NAV = [
  ['/admin', 'Dashboard', LayoutDashboard, true], ['/admin/products', 'Products', Package], ['/admin/categories', 'Categories', FolderTree], ['/admin/orders', 'Orders', ShoppingCart],
  ['/admin/customers', 'Customers', Users], ['/admin/inventory', 'Inventory', Boxes], ['/admin/offers', 'Offers', Percent], ['/admin/reviews', 'Reviews', MessageSquareQuote],
  ['/admin/coupons', 'Coupons', Ticket], ['/admin/banners', 'Banners', Image], ['/admin/collections', 'Collections', Layers], ['/admin/content', 'Content', FileText],
  ['/admin/messages', 'Contact messages', Mail], ['/admin/settings', 'Settings', Settings],
];

export default function AdminLayout() {
  const session = getSession();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const { toasts } = useStore();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); document.title = 'Admin | Hi Grove Furnitures'; window.scrollTo(0, 0); }, [pathname]);
  if (!session) return <Navigate to="/admin/login" replace state={{ from: pathname }} />;
  return (
    <div className="admin">
      <meta name="robots" content="noindex" />
      <aside className={`aside ${open ? 'is-open' : ''}`}>
        <div className="aside__brand"><Brand tone="light" /></div>
        <nav aria-label="Admin">{NAV.map(([to, l, Icon, end]) => <NavLink key={to} to={to} end={end}><Icon size={17} />{l}</NavLink>)}</nav>
        <div className="aside__foot">
          <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} />View store</a>
          <button onClick={() => { signOut(); nav('/admin/login'); }}><LogOut size={16} />Sign out</button>
        </div>
      </aside>
      {open && <button className="aside__scrim" aria-label="Close menu" onClick={() => setOpen(false)} />}
      <div className="admin__main">
        <div className="admin__top">
          <button className="aicon admin__burger" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
          <span className="admin__who">{session.email}</span>
        </div>
        {session.demo && <div className="admin__demo"><AlertTriangle size={15} />Demo mode. Sign-in is not verified and data is saved in this browser only. Connect a backend before going live.</div>}
        <div className="admin__page"><Outlet /></div>
      </div>
      <Toasts items={toasts} />
    </div>
  );
}
