import { useEffect, useRef, useState } from 'react';
import { COL } from './util';

export default function Dialog({ title, fields, initial, onSave, onDelete, onClose }) {
  const ref = useRef();
  const [v, setV] = useState(initial);
  const [armed, setArmed] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!ref.current.open) ref.current.showModal(); }, []);
  const set = (name, val) => setV((o) => ({ ...o, [name]: name.endsWith('_id') ? +val : val }));

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try { await onSave(v); onClose(); } catch (x) { setErr(x.message); setBusy(false); }
  };
  const del = async () => {
    if (!armed) return setArmed(true);
    try { await onDelete(); onClose(); } catch (x) { setErr(x.message); }
  };

  return (
    <dialog ref={ref} onClose={onClose}>
      <form id="dlgF" onSubmit={submit}>
        <h2>{title}</h2>
        {fields.map((f) => f.type === 'color' ? (
          <fieldset key={f.name}>
            <legend>{f.label}</legend>
            <div className="sws">
              {COL.map((c) => (
                <label className="sw" key={c}>
                  <input type="radio" name={f.name} checked={v[f.name] === c} onChange={() => set(f.name, c)} aria-label={`Colour ${c}`} />
                  <span style={{ background: c }} />
                </label>
              ))}
            </div>
          </fieldset>
        ) : (
          <label key={f.name}>{f.label}
            {f.type === 'select' ? (
              <select value={v[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)}>
                {f.options.map(([val, l]) => <option key={val} value={val}>{l}</option>)}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea rows="3" value={v[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)} />
            ) : (
              <input type={f.type} value={v[f.name] ?? ''} required={f.required} onChange={(e) => set(f.name, e.target.value)} />
            )}
          </label>
        ))}
        {err && <p className="err">{err}</p>}
        <div className="acts">
          {onDelete && <button type="button" className="btn red" onClick={del}>{armed ? 'Tap again to delete' : 'Delete'}</button>}
          <button type="button" className="btn alt" onClick={onClose}>Cancel</button>
          <button className="btn" disabled={busy}>Save</button>
        </div>
      </form>
    </dialog>
  );
}
