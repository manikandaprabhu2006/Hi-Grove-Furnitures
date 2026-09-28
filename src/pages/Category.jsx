import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import SEO from '../components/SEO';
import Catalog from '../components/Catalog';
import ProductImage from '../components/ProductImage';
import NotFound from './NotFound';
import { useStore } from '../store/StoreContext';

export default function Category() {
  const { slug } = useParams();
  const [sp] = useSearchParams();
  const { categories, products } = useStore();
  const cat = categories.find((c) => c.slug === slug);
  const sub = sp.get('sub');
  const inCat = useMemo(() => products.filter((p) => p.categoryId === cat?.id), [products, cat]);
  const items = sub ? inCat.filter((p) => p.subcategory === sub) : inCat;
  if (!cat) return <NotFound />;
  return (
    <>
      <SEO title={`${sub ? `${sub}, ` : ''}${cat.name} Teak Furniture`} description={`${cat.description} Hi Grove Furnitures, Tirunelveli.`} />
      <header className="cathero grain-bg">
        <div className="wrap cathero__in">
          <div>
            <h1 className="display">{cat.name.toUpperCase()}</h1>
            <p className="cathero__tag">{cat.tagline}</p>
            <p className="cathero__desc">{cat.description}</p>
            <nav className="chips" aria-label="Subcategories">
              <Link to={`/category/${cat.slug}`} className={!sub ? 'is-on' : ''}>All</Link>
              {cat.subcategories.map((s) => <Link key={s} to={`/category/${cat.slug}?sub=${encodeURIComponent(s)}`} className={sub === s ? 'is-on' : ''}>{s}</Link>)}
            </nav>
          </div>
          <div className="cathero__img"><ProductImage image={cat.image} product={{ name: `${cat.name} lifestyle`, color: 'Natural Teak' }} eager /></div>
        </div>
      </header>
      <Catalog key={`${slug}-${sub}`} items={items} showCategory={false} />
    </>
  );
}
