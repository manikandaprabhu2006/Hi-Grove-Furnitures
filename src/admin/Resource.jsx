import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useRepo, repo } from '../services/db';
import { useStore } from '../store/StoreContext';
import { DataTable, Modal, PageHead } from './ui';

/** Generic list + create/edit modal for simple collections. */
export default function Resource({ name, title, sub, columns, blank, form, validate, addLabel = 'Add', wide, extra }) {
  const [rows] = useRepo(name);
  const { toast } = useStore();
  const [edit, setEdit] = useState(null);
  const [err, setErr] = useState('');
  const set = (k) => (v) => setEdit((e) => ({ ...e, [k]: v }));
  const save = async () => {
    const m = validate?.(edit, rows); if (m) return setErr(m);
    try {
      const exists = rows.some((r) => r.id === edit.id);
      if (exists) await repo(name).update(edit.id, edit); else await repo(name).create(edit);
      toast('Saved.'); setEdit(null); setErr('');
    } catch (e) { setErr(e.message === 'STORAGE_FULL' ? 'Browser storage is full. Remove large images and try again.' : 'Could not save.'); }
  };
  const del = async () => { if (window.confirm('Delete this record? This cannot be undone.')) { await repo(name).remove(edit.id); toast('Deleted.'); setEdit(null); } };
  return (
    <>
      <PageHead title={title} sub={sub} actions={<button className="btn btn--gold btn--sm" onClick={() => { setErr(''); setEdit(blank()); }}><Plus size={15} />{addLabel}</button>} />
      {extra}
      <DataTable rows={rows} columns={columns} onRow={(r) => { setErr(''); setEdit({ ...r }); }} />
      {edit && (
        <Modal title={rows.some((r) => r.id === edit.id) ? `Edit ${title.toLowerCase()}` : addLabel} onClose={() => setEdit(null)} wide={wide}>
          <div className="aform">{form(edit, set, setEdit)}</div>
          {err && <p className="error" role="alert">{err}</p>}
          <div className="amodal__foot">
            {rows.some((r) => r.id === edit.id) && <button className="btn btn--danger btn--sm" onClick={del}><Trash2 size={14} />Delete</button>}
            <span className="spacer" /><button className="btn btn--ghost btn--sm" onClick={() => setEdit(null)}>Cancel</button><button className="btn btn--gold btn--sm" onClick={save}>Save</button>
          </div>
        </Modal>
      )}
    </>
  );
}
