import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Loader from './components/Loader';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Category from './pages/Category';
import Product from './pages/Product';
import Search from './pages/Search';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import { OrdersList, OrderTrack } from './pages/Orders';
import { About, Offers, FAQ, Contact } from './pages/Info';
import NotFound from './pages/NotFound';

// Admin is code-split: customers never download it.
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const Login = lazy(() => import('./admin/Login'));
const Dashboard = lazy(() => import('./admin/Dashboard'));
const Products = lazy(() => import('./admin/Products'));
const Inventory = lazy(() => import('./admin/Inventory'));
const AO = lazy(() => import('./admin/Orders').then((m) => ({ default: m.AdminOrders })));
const AOD = lazy(() => import('./admin/Orders').then((m) => ({ default: m.AdminOrderDetail })));
const Cu = lazy(() => import('./admin/Customers').then((m) => ({ default: m.Customers })));
const CuD = lazy(() => import('./admin/Customers').then((m) => ({ default: m.CustomerDetail })));
const M = (n) => lazy(() => import('./admin/Manage').then((m) => ({ default: m[n] })));
const Categories = M('Categories'), AdminOffers = M('Offers'), Coupons = M('Coupons'), Banners = M('Banners'), Collections = M('Collections'), Reviews = M('Reviews'), Messages = M('Messages'), Content = M('Content'), AdminSettings = M('AdminSettings');

export default function App() {
  return (
    <Loader>
      <Suspense fallback={<div className="pageload" role="status" aria-label="Loading" />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="category/:slug" element={<Category />} />
            <Route path="product/:slug" element={<Product />} />
            <Route path="search" element={<Search />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="account" element={<Account />} />
            <Route path="orders" element={<OrdersList />} />
            <Route path="orders/:id" element={<OrderTrack />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="offers" element={<Offers />} />
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="admin/login" element={<Login />} />
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="orders" element={<AO />} />
            <Route path="orders/:id" element={<AOD />} />
            <Route path="customers" element={<Cu />} />
            <Route path="customers/:id" element={<CuD />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="offers" element={<AdminOffers />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="banners" element={<Banners />} />
            <Route path="collections" element={<Collections />} />
            <Route path="content" element={<Content />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </Loader>
  );
}
