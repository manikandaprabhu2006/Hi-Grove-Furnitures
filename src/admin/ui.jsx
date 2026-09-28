import { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';

export const Field = ({ label, children, hint, wide }) => <div className={`afield ${wide ? 'afield--wide' : ''}`}><label>{label}{children}</label>{hint && <small>{hint}</small>}</div>;
export const Inp = ({ label, value, onChange, type = 'text', wide, hint, ...p }) => (
  <Field label={label} wide={wide} hint={hint}><input type={type} value={value ?? ''} onChange={(e) => onChange(type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)} {...p} /></Field>
);
export const Txt = ({ label, value, onChange, rows = 4, hint }) => <Field label={label} wide hint={hint}><textarea rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} /></Field>;
export const Sel = ({ label, value, onChange, options, wide }) => (
  <Field label={label} wide={wide}><select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>{options.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return <option key={v} value={v}>{l}</option>; })}</select></Field>
);
export const Tog = ({ label, value, onChange }) => <label className="atog"><input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /><span>{label}</span></label>;

export const Pill = ({ children, tone }) => <span className={`apill apill--${tone || String(children).toLowerCase().replace(/\s/g, '')}`}>{children}</span>;

export function Modal({ title, onClose, children, wide }) {
  return (
    <div className="amodal" onClick={onClose}>
      <div className={`amodal__box ${wide ? 'amodal__box--wide' : ''}`} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <header><h2>{title}</h2><button className="aicon" onClick={onClose} aria-label="Close"><X size={18} /></button></header>
        <div className="amodal__body">{children}</div>
      </div>
    </div>
  );
}

export function PageHead({ title, sub, actions }) {
  return <header className="ahead"><div><h1>{title}</h1>{sub && <p>{sub}</p>}</div><div className="row">{actions}</div></header>;
}

/** Generic sortable/searchable table. columns: [{ key, label, render?, num? }] */
export function DataTable({ rows, columns, onRow, search = true, empty = 'Nothing here yet.', pageSize = 12, searchKeys }) {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState(null);
  const filtered = useMemo(() => {
    let l = rows;
    if (q) { const t = q.toLowerCase(); l = l.filter((r) => (searchKeys || columns.map((c) => c.key)).some((k) => String(r[k] ?? '').toLowerCase().includes(t))); }
    if (sort) l = [...l].sort((a, b) => { const A = a[sort.k], B = b[sort.k]; const c = typeof A === 'number' ? A - B : String(A ?? '').localeCompare(String(B ?? '')); return sort.d * c; });
    return l;
  }, [rows, q, sort, columns, searchKeys]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const cur = Math.min(page, pages - 1);
  const view = filtered.slice(cur * pageSize, cur * pageSize + pageSize);
  return (
    <div className="acard">
      {search && <div className="atable__bar"><label className="asearch"><Search size={15} /><span className="sr">Search</span><input placeholder="Search" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} /></label><span className="amuted">{filtered.length} records</span></div>}
      <div className="atable__wrap">
        <table className="atable">
          <thead><tr>{columns.map((c) => <th key={c.key} className={c.num ? 'num' : ''}><button onClick={() => setSort(sort?.k === c.key ? { k: c.key, d: -sort.d } : { k: c.key, d: 1 })}>{c.label}{sort?.k === c.key ? (sort.d > 0 ? ' ↑' : ' ↓') : ''}</button></th>)}</tr></thead>
          <tbody>
            {view.map((r) => (
              <tr key={r.id} onClick={onRow ? () => onRow(r) : undefined} className={onRow ? 'is-click' : ''}>
                {columns.map((c) => <td key={c.key} className={c.num ? 'num' : ''}>{c.render ? c.render(r) : r[c.key]}</td>)}
              </tr>
            ))}
            {!view.length && <tr><td colSpan={columns.length} className="aempty">{empty}</td></tr>}
          </tbody>
        </table>
      </div>
      {pages > 1 && <div className="apager"><button disabled={cur === 0} onClick={() => setPage(cur - 1)}>Previous</button><span>Page {cur + 1} of {pages}</span><button disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)}>Next</button></div>}
    </div>
  );
}

/** Minimal SVG charts (no chart dependency). */
export function LineChart({ data, height = 220, color = '#C9A45C', format = (v) => v, fill = true }) {
  if (!data.length) return <p className="amuted">No data for this period.</p>;
  const W = 600, H = height, P = { l: 44, r: 12, t: 12, b: 26 };
  const max = Math.max(...data.map((d) => d.v), 1);
  const x = (i) => P.l + (data.length === 1 ? (W - P.l - P.r) / 2 : (i * (W - P.l - P.r)) / (data.length - 1));
  const y = (v) => H - P.b - (v / max) * (H - P.t - P.b);
  const path = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(d.v).toFixed(1)}`).join(' ');
  const step = Math.ceil(data.length / 6);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Line chart">
      {[0, 0.5, 1].map((t) => <g key={t}><line x1={P.l} x2={W - P.r} y1={y(max * t)} y2={y(max * t)} stroke="currentColor" opacity=".12" /><text x={P.l - 6} y={y(max * t) + 4} textAnchor="end" fontSize="10" fill="currentColor" opacity=".6">{format(max * t)}</text></g>)}
      {fill && <path d={`${path} L${x(data.length - 1)} ${H - P.b} L${x(0)} ${H - P.b} Z`} fill={color} opacity=".14" />}
      <path d={path} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
      {data.map((d, i) => (i % step === 0 || i === data.length - 1) && <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="currentColor" opacity=".6">{d.l}</text>)}
      {data.length < 40 && data.map((d, i) => <circle key={i} cx={x(i)} cy={y(d.v)} r="2.6" fill={color}><title>{`${d.l}: ${format(d.v)}`}</title></circle>)}
    </svg>
  );
}

export function BarChart({ data, height = 220, color = '#B9824A', format = (v) => v, horizontal = false }) {
  if (!data.length) return <p className="amuted">No data for this period.</p>;
  const max = Math.max(...data.map((d) => d.v), 1);
  if (horizontal) {
    return (
      <div className="hbars">{data.map((d) => (
        <div key={d.l} className="hbars__row"><span className="hbars__l" title={d.l}>{d.l}</span><span className="hbars__b"><i style={{ width: `${(d.v / max) * 100}%`, background: color }} /></span><b>{format(d.v)}</b></div>
      ))}</div>
    );
  }
  const W = 600, H = height, P = { l: 44, r: 12, t: 12, b: 26 };
  const bw = (W - P.l - P.r) / data.length;
  const step = Math.ceil(data.length / 8);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Bar chart">
      {[0, 0.5, 1].map((t) => { const yy = H - P.b - t * (H - P.t - P.b); return <g key={t}><line x1={P.l} x2={W - P.r} y1={yy} y2={yy} stroke="currentColor" opacity=".12" /><text x={P.l - 6} y={yy + 4} textAnchor="end" fontSize="10" fill="currentColor" opacity=".6">{format(max * t)}</text></g>; })}
      {data.map((d, i) => { const h = (d.v / max) * (H - P.t - P.b); return <g key={i}><rect x={P.l + i * bw + bw * 0.18} y={H - P.b - h} width={bw * 0.64} height={h} fill={color} rx="2"><title>{`${d.l}: ${format(d.v)}`}</title></rect>{i % step === 0 && <text x={P.l + i * bw + bw / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="currentColor" opacity=".6">{d.l}</text>}</g>; })}
    </svg>
  );
}
