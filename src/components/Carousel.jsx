import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function Carousel({ items }) {
  const ref = useRef(null);
  const by = (d) => ref.current?.scrollBy({ left: d * (ref.current.clientWidth * 0.8), behavior: 'smooth' });
  return (
    <div className="carousel">
      <button className="icon-btn carousel__nav carousel__nav--l" onClick={() => by(-1)} aria-label="Scroll left"><ChevronLeft /></button>
      <div className="carousel__track" ref={ref} tabIndex={0} aria-label="Product carousel">
        {items.map((p) => <div className="carousel__item" key={p.id}><ProductCard product={p} /></div>)}
      </div>
      <button className="icon-btn carousel__nav carousel__nav--r" onClick={() => by(1)} aria-label="Scroll right"><ChevronRight /></button>
    </div>
  );
}
