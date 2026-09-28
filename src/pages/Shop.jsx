import SEO from '../components/SEO';
import Catalog from '../components/Catalog';
import { useStore } from '../store/StoreContext';

export default function Shop() {
  const { products } = useStore();
  return (
    <>
      <SEO title="Shop Teak Wood Furniture Online" description="Browse premium teak wood sofas, beds, dining tables, office desks and decor from Hi Grove Furnitures, Tirunelveli." />
      <header className="pagehead pagehead--dark grain-bg"><div className="wrap"><h1 className="display">ALL FURNITURE</h1><p>Solid teak pieces for every room.</p></div></header>
      <Catalog items={products} />
    </>
  );
}
