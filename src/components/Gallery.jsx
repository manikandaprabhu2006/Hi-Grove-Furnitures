import { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductImage, { imageLabel } from './ProductImage';

/** Fullscreen gallery: zoom, thumbnails, keyboard (← → Esc +/-), swipe on touch. */
export default function Gallery({ product, index, onClose, onIndex }) {
  const imgs = product.images || [];
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const go = useCallback((d) => { setZoom(false); onIndex((index + d + imgs.length) % imgs.length); }, [index, imgs.length, onIndex]);

  useEffect(() => {
    const k = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === '+' || e.key === '=') setZoom(true);
      if (e.key === '-') setZoom(false);
    };
    document.addEventListener('keydown', k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = prev; };
  }, [go, onClose]);

  const move = (e) => {
    if (!zoom) return;
    const b = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - b.left) / b.width) * 100}% ${((e.clientY - b.top) / b.height) * 100}%`);
  };

  return (
    <motion.div className="gallery" role="dialog" aria-modal="true" aria-label={`${product.name} gallery`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="gallery__bar">
        <span className="gallery__title">{product.name}<small>{imageLabel(imgs[index], index)} · {index + 1} / {imgs.length}</small></span>
        <span className="row">
          <button className="icon-btn" onClick={() => setZoom((z) => !z)} aria-label={zoom ? 'Zoom out' : 'Zoom in'}>{zoom ? <ZoomOut size={18} /> : <ZoomIn size={18} />}</button>
          <button className="icon-btn" onClick={onClose} aria-label="Close gallery"><X size={18} /></button>
        </span>
      </div>
      <div className="gallery__stage">
        <button className="gallery__nav gallery__nav--l icon-btn" onClick={() => go(-1)} aria-label="Previous image"><ChevronLeft /></button>
        <motion.div key={index} className={`gallery__img ${zoom ? 'is-zoom' : ''}`} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          drag={zoom ? false : 'x'} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.25}
          onDragEnd={(_, i) => { if (i.offset.x < -70) go(1); else if (i.offset.x > 70) go(-1); }}
          onClick={() => setZoom((z) => !z)} onMouseMove={move} style={{ transformOrigin: origin }}>
          <div className="gallery__zoomer" style={{ transform: zoom ? 'scale(2.2)' : 'scale(1)', transformOrigin: origin }}>
            <ProductImage product={product} index={index} eager />
          </div>
        </motion.div>
        <button className="gallery__nav gallery__nav--r icon-btn" onClick={() => go(1)} aria-label="Next image"><ChevronRight /></button>
      </div>
      <div className="gallery__thumbs">
        {imgs.map((im, i) => (
          <button key={i} className={i === index ? 'is-on' : ''} onClick={() => { setZoom(false); onIndex(i); }} aria-label={`Show ${imageLabel(im, i)}`}>
            <ProductImage product={product} index={i} />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
