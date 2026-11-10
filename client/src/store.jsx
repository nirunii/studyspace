import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from './api';
import { formFor } from './forms';
import { t5 } from './util';
import { demoData } from './demo';
import Dialog from './Dialog';

const Ctx = createContext();
export const useStore = () => useContext(Ctx);
const PATH = { subjects: '/subjects', assignments: '/assignments', sessions: '/sessions', exams: '/exams' };
const WHAT = { subjects: 'subjects', assignments: 'assignments', sessions: 'study sessions', exams: 'exams' };

// guest = true: shows read-only sample data and asks the visitor to sign up for anything that saves.
export function Store({ children, guest, openAuth }) {
  const [data, setData] = useState(() => (guest ? demoData() : { subjects: [], assignments: [], sessions: [], exams: [] }));
  const [loading, setLoading] = useState(!guest);
  const [error, setError] = useState('');
  const [form, setForm] = useState(null);

  const load = useCallback(async (kinds = Object.keys(PATH)) => {
    const res = await Promise.all(kinds.map((k) => api(PATH[k])));
    setData((d) => { const n = { ...d }; kinds.forEach((k, i) => { n[k] = res[i]; }); return n; });
    setError('');
  }, []);
  const loadAll = useCallback(() => {
    setLoading(true);
    load().catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [load]);
  useEffect(() => { if (!guest) loadAll(); }, [guest, loadAll]);

  const gate = (reason) => openAuth('signup', reason);

  const save = async (kind, item) => {
    if (guest) return gate('Create a free account to save your changes.');
    if (item.id) await api(`${PATH[kind]}/${item.id}`, 'PUT', item);
    else await api(PATH[kind], 'POST', item);
    await load([kind]);
  };
  const remove = async (kind, id) => {
    await api(`${PATH[kind]}/${id}`, 'DELETE');
    await load(kind === 'subjects' ? undefined : [kind]); // deleting a subject also removes its tasks
  };
  const openForm = (kind, item) => {
    if (guest) return gate(`Create a free account to ${item ? 'edit' : 'add'} your own ${WHAT[kind]}.`);
    if (kind !== 'subjects' && !data.subjects.length) { location.hash = '#subjects'; kind = 'subjects'; item = null; }
    setForm({ kind, item });
  };

  let dialog = null;
  if (form) {
    const cfg = formFor(form.kind, data.subjects);
    let initial = form.item ? { ...form.item } : cfg.blank;
    if (form.item && form.kind === 'sessions') initial = { ...initial, start_time: t5(initial.start_time), end_time: t5(initial.end_time) };
    dialog = (
      <Dialog
        title={(form.item ? 'Edit ' : 'Add ') + cfg.title}
        fields={cfg.fields}
        initial={initial}
        onSave={(v) => save(form.kind, { ...v, id: form.item && form.item.id })}
        onDelete={form.item ? () => remove(form.kind, form.item.id) : null}
        onClose={() => setForm(null)}
      />
    );
  }

  return <Ctx.Provider value={{ ...data, guest, loading, error, reload: loadAll, openAuth, save, remove, openForm }}>{children}{dialog}</Ctx.Provider>;
}
