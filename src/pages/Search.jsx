import { useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, SearchX } from 'lucide-react';
import SEO from '../components/SEO';
import { ProductGrid } from '../components/ProductCard';
import { Empty } from '../components/Bits';
import { useStore } from '../store/StoreContext';

const SUGGEST = ['Teak Sofa', 'Dining Table', 'King Size Bed', 'Coffee Table', 'Office Table'];

export default function Search() {
  const [sp, setSp] = useSearchParams();
  const q = sp.get('q') || '';
  const { products, catById } = useStore();
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return products.filter((p) => {
      const hay = [p.name, p.subcategory, p.material, p.finish, p.color, p.shortDescription, p.sku, catById[p.categoryId]?.name].join(' ').toLowerCase();
      return terms.every((t) => hay.includes(t) || hay.includes(t.replace(/s$/, '')));
    });
  }, [q, products, catById]);

  return (
    <>
      <SEO title="Search Furniture" description="Search teak sofas, dining tables, beds, desks and more at Hi Grove Furnitures." noindex />
      <section className="searchpage grain-bg">
        <div className="wrap">
          <h1 className="sr">Search</h1>
          <label className="bigsearch"><SearchIcon size={26} /><span className="sr">Search furniture</span>
            <input ref={ref} type="search" value={q} onChange={(e) => setSp(e.target.value ? { q: e.target.value } : {}, { replace: true })} placeholder="Search furniture, collections, materials..." />
          </label>
          <div className="chips chips--light" aria-label="Suggestions">{SUGGEST.map((s) => <button key={s} onClick={() => setSp({ q: s })}>{s}</button>)}</div>
        </div>
      </section>
      <div className="wrap section--tight">
        {q ? (results.length ? (<><p className="muted" aria-live="polite">{results.length} {results.length === 1 ? 'result' : 'results'} for “{q}”</p><ProductGrid items={results} /></>)
          : <Empty icon={SearchX} title="NO PIECES FOUND." text={`Nothing matched “${q}”. Try a different word or browse the full collection.`} cta="EXPLORE COLLECTION" />)
          : <p className="muted center">Start typing to see matching furniture.</p>}
      </div>
    </>
  );
}
