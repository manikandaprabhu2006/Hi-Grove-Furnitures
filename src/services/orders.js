import { repo } from './db';

export const ORDER_STEPS = ['Order Placed', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
export const STATUS_TO_STEP = { Pending: 0, Confirmed: 1, Processing: 2, Packed: 3, Shipped: 4, 'Out for Delivery': 5, Delivered: 6 };

const nextOrderId = () => `HGF-${100000 + Math.floor(Math.random() * 899999)}`;

/** Creates an order and reserves stock. On a real backend this must be one transaction. */
export async function placeOrder({ customer, address, delivery, paymentMethod, totals, couponCode, userId = 'u_demo' }) {
  const now = new Date().toISOString();
  const order = {
    id: nextOrderId(), userId, customerName: customer.name,
    items: totals.items.map((i) => ({ productId: i.product.id, name: i.product.name, sku: i.product.sku, price: i.product.price, qty: i.qty, image: i.product.images?.[0] })),
    subtotal: totals.subtotal, discount: totals.discount, shipping: totals.shipping, tax: totals.tax, total: totals.total,
    couponCode: couponCode || '', delivery, paymentMethod, paymentStatus: 'Pending', orderStatus: 'Pending',
    shippingAddress: { name: customer.name, phone: customer.phone, email: customer.email, ...address },
    createdAt: now, notes: '', timeline: [{ status: 'Pending', at: now }],
  };
  await repo('orders').create(order);
  const prods = repo('products');
  for (const i of totals.items) {
    const p = (await prods.get(i.product.id));
    if (p) await prods.update(p.id, { reserved: (p.reserved || 0) + i.qty });
  }
  if (totals.coupon) await repo('coupons').update(totals.coupon.id, { usedCount: (totals.coupon.usedCount || 0) + 1 });
  return order;
}

export async function setOrderStatus(order, status, extra = {}) {
  const timeline = [...(order.timeline || []), { status, at: new Date().toISOString() }];
  const patch = { orderStatus: status, timeline, ...extra };
  if (status === 'Delivered') patch.paymentStatus = order.paymentStatus === 'Void' ? 'Void' : 'Paid';
  if (status === 'Cancelled') patch.paymentStatus = 'Void';
  return repo('orders').update(order.id, patch);
}
