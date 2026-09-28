import { useRef, useState } from 'react';
import { Plus, Trash2, Star, ArrowUp, ArrowDown, UploadCloud, Eye } from 'lucide-react';
import { useRepo, repo } from '../services/db';
import { useStore } from '../store/StoreContext';
import { DataTable, Modal, PageHead, Inp, Txt, Sel, Tog, Pill, Field } from './ui';
import ProductImage, { imageLabel } from '../components/ProductImage';
import { fileToImage } from './imageUtil';
import { inr, pct, slugify, uid } from '../lib/format';
import { stockState, stockLabel } from '../lib/pricing';

const blank = (cats) => ({
  id: uid('p'), name: '', slug: '', sku: '', categoryId: cats[0]?.id || '', subcategory: '', description: '', shortDescription: '', price: '', originalPrice: '', material: 'Teak Wood', finish: '', color: '', style: '',
  dimensions: { width: '', depth: '', height: '', unit: 'cm' }, weight: '', stock: 0, minStock: 3, reserved: 0, images: [], featured: false, newArrival: false, bestSeller: false, status: 'draft', shape: 'side',
  createdAt: new Date().toISOString(),
});

export function ImageManager({ images, onChange, product }) {
  const [drag, setDrag] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const input = useRef(null);
  const [preview, setPreview] = useState(null);
  const add = async (files) => {
    setBusy(true); setMsg('');
    try {
      const out = [];
      for (const f of files) out.push({ kind: 'upload', src: await fileToImage(f), alt: '' });
      onChange([...images, ...out]);
    } catch (e) { setMsg(e.message); }
    setBusy(false);
  };
  const move = (from, to) => { if (to < 0 || to >= images.length) return; const a = [...images]; const [x] = a.splice(from, 1); a.splice(to, 0, x); onChange(a); };
  return (
    <div className="imgmgr">
      <div className="drop" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) add([...e.dataTransfer.files]); }}>
        <UploadCloud size={22} /><p>Drag images here, or <button type="button" className="link" onClick={() => input.current.click()}>browse</button></p>
        <small>The first image is the main image and thumbnail. Images are resized for demo storage.</small>
        <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => { add([...e.target.files]); e.target.value = ''; }} />
      </div>
      {busy && <p className="amuted">Processing images…</p>}{msg && <p className="error">{msg}</p>}
      <ul className="imgs">
        {images.map((im, i) => (
          <li key={i} draggable onDragStart={() => setDrag(i)} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (drag != null) move(drag, i); setDrag(null); }} className={i === 0 ? 'is-main' : ''}>
            <div className="imgs__pic"><ProductImage product={product} image={im} /></div>
            <span className="imgs__l">{i === 0 ? 'Main / thumbnail' : imageLabel(im, i)}</span>
            <div className="imgs__ctl">
              <button type="button" onClick={() => setPreview(i)} aria-label="Preview"><Eye size={14} /></button>
              {i > 0 && <button type="button" onClick={() => move(i, 0)} aria-label="Make main image"><Star size={14} /></button>}
              <button type="button" onClick={() => move(i, i - 1)} aria-label="Move earlier"><ArrowUp size={14} /></button>
              <button type="button" onClick={() => move(i, i + 1)} aria-label="Move later"><ArrowDown size={14} /></button>
              <button type="button" onClick={() => onChange(images.filter((_, k) => k !== i))} aria-label="Delete image"><Trash2 size={14} /></button>
            </div>
          </li>
        ))}
      </ul>
      {!images.length && <p className="amuted">No images yet. Pieces without images show a placeholder illustration on the store.</p>}
      {preview != null && images[preview] && <Modal title="Image preview" onClose={() => setPreview(null)}><div className="imgs__big"><ProductImage product={product} image={images[preview]} /></div></Modal>}
    </div>
  );
}

export default function Products() {
  const [rows] = useRepo('products');
  const [cats] = useRepo('categories');
  const { toast } = useStore();
  const [e, setE] = useState(null);
  const [err, setErr] = useState('');
  const set = (k) => (v) => setE((x) => ({ ...x, [k]: v }));
  const setDim = (k) => (v) => setE((x) => ({ ...x, dimensions: { ...x.dimensions, [k]: v } }));
  const cat = cats.find((c) => c.id === e?.categoryId);

  const save = async (publish) => {
    if (!e.name.trim()) return setErr('Enter a product name.');
    if (!e.sku.trim()) return setErr('Enter a SKU.');
    if (rows.some((r) => r.sku === e.sku && r.id !== e.id)) return setErr('This SKU is already used by another product.');
    if (!(Number(e.price) > 0)) return setErr('Enter a price greater than zero.');
    if (e.originalPrice && Number(e.originalPrice) < Number(e.price)) return setErr('Original price cannot be lower than the price.');
    let slug = e.slug || slugify(e.name);
    if (rows.some((r) => r.slug === slug && r.id !== e.id)) slug += `-${Math.random().toString(36).slice(2, 5)}`;
    const rec = { ...e, slug, price: Number(e.price), originalPrice: Number(e.originalPrice) || 0, stock: Number(e.stock) || 0, minStock: Number(e.minStock) || 0, status: publish ? 'published' : e.status };
    if (!rec.images.length) rec.images = [{ kind: 'art', view: 'front' }];
    rec.thumbnail = rec.images[0];
    try {
      if (rows.some((r) => r.id === e.id)) await repo('products').update(e.id, rec); else await repo('products').create(rec);
      toast(publish ? 'Product published.' : 'Product saved.'); setE(null); setErr('');
    } catch (x) { setErr(x.message === 'STORAGE_FULL' ? 'Browser storage is full. Remove some images and try again.' : 'Could not save.'); }
  };
  const del = async () => { if (window.confirm(`Delete ${e.name}?`)) { await repo('products').remove(e.id); toast('Product deleted.'); setE(null); } };

  return (
    <>
      <PageHead title="Products" sub="Add, edit and publish your catalog." actions={<button className="btn btn--gold btn--sm" onClick={() => { setErr(''); setE(blank(cats)); }}><Plus size={15} />Add product</button>} />
      <DataTable rows={rows} searchKeys={['name', 'sku', 'subcategory']} onRow={(r) => { setErr(''); setE(structuredClone(r)); }}
        columns={[
          { key: 'name', label: 'Product', render: (r) => <span className="pcell"><span className="pcell__img"><ProductImage product={r} index={0} /></span><span><b>{r.name}</b><small>{r.sku}</small></span></span> },
          { key: 'categoryId', label: 'Category', render: (r) => cats.find((c) => c.id === r.categoryId)?.name || '—' },
          { key: 'price', label: 'Price', num: true, render: (r) => inr(r.price) },
          { key: 'stock', label: 'Stock', num: true },
          { key: 'status', label: 'Status', render: (r) => <Pill tone={r.status}>{r.status}</Pill> },
        ]} />
      {e && (
        <Modal title={rows.some((r) => r.id === e.id) ? 'Edit product' : 'Add product'} onClose={() => setE(null)} wide>
          <div className="aform">
            <Inp label="Product name" value={e.name} onChange={(v) => setE({ ...e, name: v, slug: rows.some((r) => r.id === e.id) ? e.slug : slugify(v) })} />
            <Inp label="SKU" value={e.sku} onChange={set('sku')} />
            <Sel label="Category" value={e.categoryId} onChange={(v) => setE({ ...e, categoryId: v, subcategory: '' })} options={cats.map((c) => [c.id, c.name])} />
            <Sel label="Subcategory" value={e.subcategory} onChange={set('subcategory')} options={['', ...(cat?.subcategories || [])]} />
            <Inp label="Short description" value={e.shortDescription} onChange={set('shortDescription')} wide />
            <Txt label="Description" value={e.description} onChange={set('description')} rows={5} />
            <Inp label="Price (₹, includes tax)" type="number" min="0" value={e.price} onChange={set('price')} />
            <Inp label="Original price (₹)" type="number" min="0" value={e.originalPrice} onChange={set('originalPrice')} />
            <Inp label="Discount (%)" type="number" min="0" max="90" value={pct(Number(e.price), Number(e.originalPrice)) || ''} onChange={(v) => v && Number(e.price) ? setE({ ...e, originalPrice: Math.round(Number(e.price) / (1 - v / 100)) }) : setE({ ...e, originalPrice: '' })} hint="Sets the original price from the price." />
            <Inp label="Material" value={e.material} onChange={set('material')} />
            <Inp label="Finish" value={e.finish} onChange={set('finish')} />
            <Inp label="Color" value={e.color} onChange={set('color')} hint="Natural Teak, Rich Teak or Honey Teak match the demo illustrations." />
            <Inp label="Style (optional)" value={e.style} onChange={set('style')} />
            <Inp label="Width (cm)" type="number" value={e.dimensions.width} onChange={setDim('width')} />
            <Inp label="Depth (cm)" type="number" value={e.dimensions.depth} onChange={setDim('depth')} />
            <Inp label="Height (cm)" type="number" value={e.dimensions.height} onChange={setDim('height')} />
            <Inp label="Weight" value={e.weight} onChange={set('weight')} placeholder="e.g. 14 kg" />
            <Inp label="Stock" type="number" min="0" value={e.stock} onChange={set('stock')} />
            <Inp label="Minimum stock" type="number" min="0" value={e.minStock} onChange={set('minStock')} />
            <Field label="Flags" wide><span className="atogs"><Tog label="Featured" value={e.featured} onChange={set('featured')} /><Tog label="New arrival" value={e.newArrival} onChange={set('newArrival')} /><Tog label="Bestseller" value={e.bestSeller} onChange={set('bestSeller')} /></span></Field>
            <Sel label="Status" value={e.status} onChange={set('status')} options={['draft', 'published', 'archived']} />
            <Field label="Images" wide><ImageManager images={e.images} onChange={set('images')} product={e} /></Field>
          </div>
          {err && <p className="error" role="alert">{err}</p>}
          <div className="amodal__foot">
            {rows.some((r) => r.id === e.id) && <button className="btn btn--danger btn--sm" onClick={del}><Trash2 size={14} />Delete</button>}
            <span className="spacer" /><button className="btn btn--ghost btn--sm" onClick={() => save(false)}>SAVE PRODUCT</button><button className="btn btn--gold btn--sm" onClick={() => save(true)}>SAVE &amp; PUBLISH</button>
          </div>
        </Modal>
      )}
    </>
  );
}
