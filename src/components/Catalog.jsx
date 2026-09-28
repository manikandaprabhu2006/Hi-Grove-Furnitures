import { useMemo, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { ProductGrid } from './ProductCard';
import { Empty, ProductSkeletons } from './Bits';
import { useStore } from '../store/StoreContext';
import { PackageOpen } from 'lucide-react';

const PRICES = [['under15', 'Under ₹15,000', 0, 15000], ['15to30', '₹15,000 – ₹30,000', 15000, 30000], ['30to60', '₹30,000 – ₹60,000', 30000, 60000], ['60plus', '₹60,000 and above', 60000, Infinity]];
const SORTS = [['featured', 'Featured'], ['newest', 'Newest'], ['low', 'Price: Low to High'], ['high', 'Price: High to Low'], ['rated', 'Best Rated']];

const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export default function Catalog({ items, showCategory = true, initial = {} }) {
  const { categories, collections, ratings, available, loading } = useStore();
  const [f, setF] = useState({ cats: [], price: [], materials: [], colors: [], avail: [], rating: 0, cols: [], ...initial });
  const [sort, setSort] = useState('featured');
  const [open, setOpen] = useState(false);

  const materials = useMemo(() => [...new Set(items.map((p) => p.material).filter(Boolean))], [items]);
  const colors = useMemo(() => [...new Set(items.map((p) => p.color).filter(Boolean))], [items]);

  const shown = useMemo(() => {
    let l = items.filter((p) => {
      if (f.cats.length && !f.cats.includes(p.categoryId)) return false;
      if (f.price.length && !f.price.some((k) => { const r = PRICES.find((x) => x[0] === k); return p.price >= r[2] && p.price < r[3]; })) return false;
      if (f.materials.length && !f.materials.includes(p.material)) return false;
      if (f.colors.length && !f.colors.includes(p.color)) return false;
      if (f.avail.length && !f.avail.includes(available(p) > 0 ? 'in' : 'out')) return false;
      if (f.rating && (ratings[p.id]?.avg || 0) < f.rating) return false;
      if (f.cols.length && !f.cols.some((cid) => collections.find((c) => c.id === cid)?.productIds.includes(p.id))) return false;
      return true;
    });
    const by = { featured: (a, b) => Number(b.featured) - Number(a.featured), newest: (a, b) => (b.createdAt || '').localeCompare(a.createdAt || '') || Number(b.newArrival) - Number(a.newArrival), low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, rated: (a, b) => (ratings[b.id]?.avg || 0) - (ratings[a.id]?.avg || 0) };
    return [...l].sort(by[sort]);
  }, [items, f, sort, ratings, collections, available]);

  const active = f.cats.length + f.price.length + f.materials.length + f.colors.length + f.avail.length + f.cols.length + (f.rating ? 1 : 0);
  const clear = () => setF({ cats: [], price: [], materials: [], colors: [], avail: [], rating: 0, cols: [] });

  const Group = ({ title, children }) => <fieldset className="fgroup"><legend>{title}</legend>{children}</fieldset>;
  const Check = ({ checked, onChange, label }) => <label className="check"><input type="checkbox" checked={checked} onChange={onChange} /><span>{label}</span></label>;

  const panel = (
    <div className="filters__body">
      {showCategory && <Group title="Category">{categories.map((c) => <Check key={c.id} checked={f.cats.includes(c.id)} onChange={() => setF({ ...f, cats: toggle(f.cats, c.id) })} label={c.name} />)}</Group>}
      <Group title="Price">{PRICES.map(([k, l]) => <Check key={k} checked={f.price.includes(k)} onChange={() => setF({ ...f, price: toggle(f.price, k) })} label={l} />)}</Group>
      {materials.length > 1 && <Group title="Material">{materials.map((m) => <Check key={m} checked={f.materials.includes(m)} onChange={() => setF({ ...f, materials: toggle(f.materials, m) })} label={m} />)}</Group>}
      {colors.length > 1 && <Group title="Color">{colors.map((m) => <Check key={m} checked={f.colors.includes(m)} onChange={() => setF({ ...f, colors: toggle(f.colors, m) })} label={m} />)}</Group>}
      <Group title="Availability">{[['in', 'In stock'], ['out', 'Out of stock']].map(([k, l]) => <Check key={k} checked={f.avail.includes(k)} onChange={() => setF({ ...f, avail: toggle(f.avail, k) })} label={l} />)}</Group>
      <Group title="Rating">{[4, 3].map((n) => <Check key={n} checked={f.rating === n} onChange={() => setF({ ...f, rating: f.rating === n ? 0 : n })} label={`${n} stars and up`} />)}</Group>
      {collections.filter((c) => c.status === 'active').length > 0 && <Group title="Collection">{collections.filter((c) => c.status === 'active').map((c) => <Check key={c.id} checked={f.cols.includes(c.id)} onChange={() => setF({ ...f, cols: toggle(f.cols, c.id) })} label={c.name} />)}</Group>}
    </div>
  );

  return (
    <div className="catalog wrap">
      <aside className="filters" aria-label="Filters"><div className="filters__head"><h2>Filters</h2>{active > 0 && <button className="link" onClick={clear}>Clear all</button>}</div>{panel}</aside>
      <div className="catalog__main">
        <div className="catalog__bar">
          <button className="btn btn--ghost btn--sm catalog__filterbtn" onClick={() => setOpen(true)}><SlidersHorizontal size={16} />Filters{active > 0 ? ` (${active})` : ''}</button>
          <p className="muted" aria-live="polite">{shown.length} {shown.length === 1 ? 'piece' : 'pieces'}</p>
          <label className="sort"><span className="sr">Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>{SORTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          </label>
        </div>
        {loading ? <ProductSkeletons /> : shown.length ? <ProductGrid items={shown} /> : (
          <Empty icon={PackageOpen} title={items.length ? 'NO PIECES MATCH THESE FILTERS.' : 'NO PRODUCTS YET.'} text={items.length ? 'Try removing a filter.' : 'New pieces are on the way.'} cta={active ? null : 'EXPLORE COLLECTION'} />
        )}
        {active > 0 && !shown.length && <div className="center"><button className="btn btn--ghost" onClick={clear}>Clear filters</button></div>}
      </div>
      {open && (
        <div className="fsheet" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="fsheet__top"><h2>Filters</h2><button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close filters"><X /></button></div>
          {panel}
          <div className="fsheet__foot"><button className="btn btn--ghost" onClick={clear}>Clear all</button><button className="btn btn--gold" onClick={() => setOpen(false)}>Show {shown.length} pieces</button></div>
        </div>
      )}
    </div>
  );
}
