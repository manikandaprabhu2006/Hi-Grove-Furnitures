import { useState } from 'react';
import { useRepo, repo } from '../services/db';
import { useStore } from '../store/StoreContext';
import { DataTable, Modal, PageHead, Pill, Inp } from './ui';
import { stockState, stockLabel } from '../lib/pricing';

export default function Inventory() {
  const [rows] = useRepo('products');
  const { toast } = useStore();
  const [adj, setAdj] = useState(null);
  const data = rows.map((p) => ({ ...p, available: Math.max(0, p.stock - (p.reserved || 0)), state: stockState(p) }));
  return (
    <>
      <PageHead title="Inventory" sub="Available stock is stock minus units reserved by open orders." />
      <DataTable rows={data} searchKeys={['name', 'sku']} onRow={(p) => setAdj({ id: p.id, name: p.name, stock: p.stock, minStock: p.minStock ?? 0, delta: 0 })} columns={[
        { key: 'sku', label: 'SKU' }, { key: 'name', label: 'Product' }, { key: 'stock', label: 'Stock', num: true }, { key: 'reserved', label: 'Reserved', num: true, render: (p) => p.reserved || 0 },
        { key: 'available', label: 'Available', num: true }, { key: 'minStock', label: 'Low at', num: true },
        { key: 'state', label: 'Status', render: (p) => <Pill tone={p.state === 'in' ? 'published' : p.state === 'low' ? 'pending' : 'cancelled'}>{stockLabel[p.state]}</Pill> }]} />
      {adj && (
        <Modal title={`Adjust stock: ${adj.name}`} onClose={() => setAdj(null)}>
          <div className="aform">
            <Inp label="Current stock" type="number" min="0" value={adj.stock} onChange={(v) => setAdj({ ...adj, stock: v })} />
            <Inp label="Add or remove units" type="number" value={adj.delta} onChange={(v) => setAdj({ ...adj, delta: v })} hint="Use a negative number to remove stock." />
            <Inp label="Low stock alert at" type="number" min="0" value={adj.minStock} onChange={(v) => setAdj({ ...adj, minStock: v })} />
          </div>
          <p className="amuted">New stock: <b>{Math.max(0, (Number(adj.stock) || 0) + (Number(adj.delta) || 0))}</b></p>
          <div className="amodal__foot"><span className="spacer" /><button className="btn btn--ghost btn--sm" onClick={() => setAdj(null)}>Cancel</button>
            <button className="btn btn--gold btn--sm" onClick={async () => { await repo('products').update(adj.id, { stock: Math.max(0, (Number(adj.stock) || 0) + (Number(adj.delta) || 0)), minStock: Number(adj.minStock) || 0 }); toast('Stock updated.'); setAdj(null); }}>Save</button></div>
        </Modal>
      )}
    </>
  );
}
