import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/StoreContext';
import ProductImage from './ProductImage';
import { Rating } from './Bits';
import { inr, pct, dimText } from '../lib/format';

export default function QuickView() {
  const { quick, setQuick, byId, addToCart, ratings, available } = useStore();
  const p = quick ? byId[quick] : null;
  useEffect(() => {
    if (!p) return;
    const k = (e) => e.key === 'Escape' && setQuick(null);
    document.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [p, setQuick]);
  const r = p && ratings[p.id];
  return (
    <AnimatePresence>
      {p && (
        <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setQuick(null)}>
          <motion.div className="qv" role="dialog" aria-modal="true" aria-label={`Quick view: ${p.name}`} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 16, opacity: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()}>
            <button className="icon-btn qv__close" onClick={() => setQuick(null)} aria-label="Close quick view"><X size={18} /></button>
            <div className="qv__img"><ProductImage product={p} index={0} /></div>
            <div className="qv__body">
              <p className="muted">{p.subcategory}</p>
              <h2>{p.name}</h2>
              {r && <Rating value={r.avg} count={r.count} />}
              <div className="price price--lg"><span className="price__now">{inr(p.price)}</span>{pct(p.price, p.originalPrice) > 0 && <><s className="price__was">{inr(p.originalPrice)}</s><span className="price__off">{pct(p.price, p.originalPrice)}% off</span></>}</div>
              <p className="muted small">Inclusive of applicable taxes</p>
              <p>{p.shortDescription}</p>
              <dl className="specs specs--tight">
                {p.material && <><dt>Material</dt><dd>{p.material}</dd></>}
                {p.finish && <><dt>Finish</dt><dd>{p.finish}</dd></>}
                {dimText(p.dimensions) && <><dt>Size</dt><dd>{dimText(p.dimensions)}</dd></>}
              </dl>
              <div className="row">
                <button className="btn btn--gold" disabled={available(p) <= 0} onClick={() => { addToCart(p.id); setQuick(null); }}>{available(p) <= 0 ? 'OUT OF STOCK' : 'ADD TO CART'}</button>
                <Link className="btn btn--ghost" to={`/product/${p.slug}`} onClick={() => setQuick(null)}>FULL DETAILS</Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
