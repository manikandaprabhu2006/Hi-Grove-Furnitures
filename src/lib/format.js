const nf = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
export const inr = (n) => '₹' + nf.format(Math.round(Number(n) || 0));
export const pct = (price, orig) => (orig > price ? Math.round(((orig - price) / orig) * 100) : 0);
export const fmtDate = (d, opts) =>
  d ? new Date(d).toLocaleDateString('en-IN', opts || { day: 'numeric', month: 'short', year: 'numeric' }) : '';
export const slugify = (s) =>
  String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
export const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;
export const dimText = (d) =>
  d && (d.width || d.depth || d.height) ? `W ${d.width} × D ${d.depth} × H ${d.height} ${d.unit || 'cm'}` : '';
export const whatsappUrl = (msg = '') => {
  const n = import.meta.env.VITE_WHATSAPP || '919087000717';
  return `https://wa.me/${n}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;
};
