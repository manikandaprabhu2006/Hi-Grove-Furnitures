// Pure business logic. No React, no storage. Move to the server later and keep these as reference/tests.
const inWindow = (o, now = Date.now()) =>
  (!o.startDate || new Date(o.startDate).getTime() <= now) &&
  (!o.endDate || new Date(o.endDate).getTime() + 86399000 >= now);

export const isOfferLive = (o, now) => o.status === 'active' && inWindow(o, now);

const perUnitOff = (o, price) => (o.discountKind === 'flat' ? Math.min(o.discount, price) : (price * o.discount) / 100);

const offerAppliesTo = (o, product) => {
  if (o.type === 'percentage' || o.type === 'flat') return true;
  if (o.type === 'product') return (o.products || []).includes(product.id);
  if (o.type === 'category') return o.categoryId === product.categoryId;
  return false;
};

/** Best single offer per line (no stacking). Bundle offers are handled at cart level. */
export function lineOffer(product, offers, now) {
  let best = null;
  for (const o of offers) {
    if (!isOfferLive(o, now) || o.type === 'bundle' || !offerAppliesTo(o, product)) continue;
    const off = perUnitOff(o, product.price);
    if (!best || off > best.perUnit) best = { offer: o, perUnit: Math.round(off) };
  }
  return best;
}

export function validateCoupon(code, coupons, base, now = Date.now()) {
  const c = coupons.find((x) => x.code.toLowerCase() === String(code).trim().toLowerCase());
  if (!c) return { error: 'This coupon code is not valid.' };
  if (c.status !== 'active') return { error: 'This coupon is not active.' };
  if (c.startDate && new Date(c.startDate).getTime() > now) return { error: 'This coupon is not active yet.' };
  if (c.endDate && new Date(c.endDate).getTime() + 86399000 < now) return { error: 'This coupon has expired.' };
  if (c.usageLimit && (c.usedCount || 0) >= c.usageLimit) return { error: 'This coupon has reached its usage limit.' };
  if (c.minimumOrder && base < c.minimumOrder) return { error: `Add items worth ₹${c.minimumOrder} or more to use this coupon.` };
  let d = c.type === 'flat' ? c.value : (base * c.value) / 100;
  if (c.maximumDiscount) d = Math.min(d, c.maximumDiscount);
  return { coupon: c, discount: Math.round(Math.min(d, base)) };
}

export function cartTotals({ lines, offers = [], coupons = [], couponCode, settings }) {
  const now = Date.now();
  const items = lines.map((l) => {
    const lo = lineOffer(l.product, offers, now);
    const off = lo ? lo.perUnit * l.qty : 0;
    return { ...l, unit: l.product.price, gross: l.product.price * l.qty, offerOff: off, offer: lo?.offer };
  });
  const subtotal = items.reduce((s, i) => s + i.gross, 0);
  let offerDiscount = items.reduce((s, i) => s + i.offerOff, 0);
  const ids = new Set(items.map((i) => i.product.id));
  const bundles = [];
  for (const o of offers) {
    if (o.type !== 'bundle' || !isOfferLive(o, now) || !(o.products || []).length) continue;
    if (o.products.every((p) => ids.has(p))) {
      const base = items.filter((i) => o.products.includes(i.product.id)).reduce((s, i) => s + i.gross - i.offerOff, 0);
      const off = Math.round(o.discountKind === 'flat' ? Math.min(o.discount, base) : (base * o.discount) / 100);
      bundles.push({ offer: o, off });
      offerDiscount += off;
    }
  }
  const afterOffers = Math.max(0, subtotal - offerDiscount);
  const cp = couponCode ? validateCoupon(couponCode, coupons, afterOffers, now) : null;
  const couponDiscount = cp?.discount || 0;
  const taxable = Math.max(0, afterOffers - couponDiscount);
  const ship = settings?.shipping || { charge: 0, freeThreshold: 0 };
  const shipping = !items.length || (ship.freeThreshold && taxable >= ship.freeThreshold) ? 0 : ship.charge || 0;
  const tax = settings?.tax || { rate: 0, inclusive: true };
  const taxAmount = Math.round(tax.inclusive ? (taxable * tax.rate) / (100 + tax.rate) : (taxable * tax.rate) / 100);
  const total = taxable + shipping + (tax.inclusive ? 0 : taxAmount);
  return {
    items, bundles, subtotal, offerDiscount, couponDiscount, couponError: cp?.error, coupon: cp?.coupon,
    discount: offerDiscount + couponDiscount, shipping, tax: taxAmount, taxInclusive: tax.inclusive,
    taxLabel: tax.label || 'GST', total,
    freeShipGap: ship.freeThreshold && shipping > 0 ? Math.max(0, ship.freeThreshold - taxable) : 0,
  };
}

export const stockState = (p) => {
  const avail = Math.max(0, (p.stock || 0) - (p.reserved || 0));
  if (avail <= 0) return 'out';
  if (avail <= (p.minStock ?? 3)) return 'low';
  return 'in';
};
export const stockLabel = { in: 'IN STOCK', low: 'LOW STOCK', out: 'OUT OF STOCK' };
