import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useRepo, usePersisted } from '../services/db';
import { cartTotals, isOfferLive, lineOffer } from '../lib/pricing';

const Store = createContext(null);
export const useStore = () => useContext(Store);

export function StoreProvider({ children }) {
  const [allProducts, loading] = useRepo('products');
  const [categories] = useRepo('categories');
  const [collections] = useRepo('collections');
  const [offers] = useRepo('offers');
  const [coupons] = useRepo('coupons');
  const [reviews] = useRepo('reviews');
  const [settings] = useRepo('settings');
  const [home] = useRepo('home');

  const [cart, setCart] = usePersisted('cart', { lines: [], saved: [], coupon: '' });
  const [wish, setWish] = usePersisted('wishlist', []);
  const [toasts, setToasts] = useState([]);
  const [quick, setQuick] = useState(null);

  const products = useMemo(() => allProducts.filter((p) => p.status === 'published'), [allProducts]);
  const byId = useMemo(() => Object.fromEntries(allProducts.map((p) => [p.id, p])), [allProducts]);
  const bySlug = useMemo(() => Object.fromEntries(allProducts.map((p) => [p.slug, p])), [allProducts]);
  const activeCategories = useMemo(() => categories.filter((c) => c.status === 'active'), [categories]);
  const catById = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c])), [categories]);
  const liveOffers = useMemo(() => offers.filter((o) => isOfferLive(o)), [offers]);

  const ratings = useMemo(() => {
    const m = {};
    reviews.filter((r) => r.status === 'approved').forEach((r) => {
      const x = (m[r.productId] ||= { sum: 0, count: 0 });
      x.sum += r.rating; x.count += 1;
    });
    Object.values(m).forEach((x) => { x.avg = x.sum / x.count; });
    return m;
  }, [reviews]);

  const lines = useMemo(() => cart.lines.map((l) => ({ ...l, product: byId[l.productId] })).filter((l) => l.product && l.product.status === 'published'), [cart.lines, byId]);
  const totals = useMemo(() => cartTotals({ lines, offers, coupons, couponCode: cart.coupon, settings }), [lines, offers, coupons, cart.coupon, settings]);
  const cartCount = lines.reduce((s, l) => s + l.qty, 0);
  const saved = useMemo(() => cart.saved.map((id) => byId[id]).filter(Boolean), [cart.saved, byId]);
  const wishlist = useMemo(() => wish.map((id) => byId[id]).filter((p) => p && p.status === 'published'), [wish, byId]);

  const toast = useCallback((message, tone = 'ok') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t.slice(-2), { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const available = (p) => Math.max(0, (p.stock || 0) - (p.reserved || 0));

  const addToCart = useCallback((productId, qty = 1) => {
    const p = byId[productId];
    if (!p) return false;
    const max = available(p);
    if (max <= 0) { toast(`${p.name} is out of stock.`, 'warn'); return false; }
    setCart((c) => {
      const cur = c.lines.find((l) => l.productId === productId);
      const nextQty = Math.min(max, (cur?.qty || 0) + qty);
      const lines2 = cur ? c.lines.map((l) => (l.productId === productId ? { ...l, qty: nextQty } : l)) : [...c.lines, { productId, qty: nextQty }];
      return { ...c, lines: lines2, saved: c.saved.filter((x) => x !== productId) };
    });
    toast(`${p.name} added to your cart.`);
    return true;
  }, [byId, setCart, toast]);

  const setQty = (productId, qty) => {
    const p = byId[productId];
    const q = Math.max(1, Math.min(p ? available(p) || 1 : 99, qty));
    setCart((c) => ({ ...c, lines: c.lines.map((l) => (l.productId === productId ? { ...l, qty: q } : l)) }));
  };
  const removeLine = (productId) => setCart((c) => ({ ...c, lines: c.lines.filter((l) => l.productId !== productId) }));
  const saveForLater = (productId) => setCart((c) => ({ ...c, lines: c.lines.filter((l) => l.productId !== productId), saved: [...new Set([...c.saved, productId])] }));
  const removeSaved = (productId) => setCart((c) => ({ ...c, saved: c.saved.filter((x) => x !== productId) }));
  const setCoupon = (code) => setCart((c) => ({ ...c, coupon: code }));
  const clearCart = () => setCart((c) => ({ ...c, lines: [], coupon: '' }));

  const toggleWish = (productId) => {
    const on = wish.includes(productId);
    setWish(on ? wish.filter((x) => x !== productId) : [...wish, productId]);
    toast(on ? 'Removed from your wishlist.' : 'Saved to your wishlist.');
  };

  const value = {
    loading, products, allProducts, byId, bySlug, categories: activeCategories, allCategories: categories, catById, collections, offers, liveOffers, coupons, reviews, settings, home,
    ratings, lines, totals, cartCount, saved, wishlist, wish, cart,
    addToCart, setQty, removeLine, saveForLater, removeSaved, setCoupon, clearCart, toggleWish, toast, toasts, quick, setQuick, available,
    lineOffer: (p) => lineOffer(p, offers),
  };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
