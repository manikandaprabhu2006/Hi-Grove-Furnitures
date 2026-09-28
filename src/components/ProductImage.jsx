import { FurnitureArt } from './FurnitureArt';

/** Renders a product image entry: procedural demo art, an uploaded data URL, or a remote URL. */
export default function ProductImage({ product, image, index = 0, className = '', eager = false }) {
  const img = image || product?.images?.[index] || { kind: 'art', view: 'front' };
  if (img.kind === 'upload' || img.kind === 'url') {
    return <img className={className} src={img.src} alt={img.alt || product?.name || ''} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable="false" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />;
  }
  return <FurnitureArt className={className} shape={img.shape || product?.shape} view={img.view || 'front'} color={product?.color} dims={product?.dimensions} name={product?.name} />;
}

export const VIEW_LABELS = { front: 'Front', side: 'Side', lifestyle: 'Lifestyle', detail: 'Detail', grain: 'Wood grain', dims: 'Dimensions' };
export const imageLabel = (img, i) => (img.kind === 'art' ? VIEW_LABELS[img.view] || `Image ${i + 1}` : `Image ${i + 1}`);
