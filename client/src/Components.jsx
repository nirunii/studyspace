import { useStore } from './store';
import Icon from './icons';
import { ASG, PREP, ST, cd, fmt, left } from './util';

export const Head = ({ title, sub, onAdd, label }) => (
  <div className="head">
    <div><h1>{title}</h1><p className="sub">{sub}</p></div>
    {onAdd && <button className="btn" onClick={onAdd}><Icon name="plus" size={16} />{label}</button>}
  </div>
);

export const Stat = ({ i, n, l, tone = 'green' }) => (
  <div className="card stat">
    <span className={`ico ${tone}`}><Icon name={i} size={20} /></span>
    <div><div className="num">{n}</div><small>{l}</small></div>
  </div>
);

// Shown above every page: preview notice for visitors, retry notice if loading failed.
export function Banner() {
  const { guest, error, reload, openAuth } = useStore();
  if (guest) {
    return (
      <div className="banner">
        <Icon name="eye" size={18} />
        <p><b>You’re previewing StudySpace with sample data.</b> Create a free account to track your own subjects, tasks and exams.</p>
        <div className="acts">
          <button className="btn alt sm" onClick={() => openAuth('login')}>Log in</button>
          <button className="btn sm" onClick={() => openAuth('signup')}>Sign up</button>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="banner warn" role="alert">
        <Icon name="alert" size={18} />
        <p><b>Couldn’t load your data.</b> {error}</p>
        <button className="btn alt sm" onClick={reload}>Try again</button>
      </div>
    );
  }
  return null;
}

const useSubject = (id) => {
  const { subjects } = useStore();
  return subjects.find((s) => s.id === id) || { name: 'Deleted subject', color: '#9AA5A0' };
};

export function AsgItem({ a, full }) {
  const { openForm, save } = useStore();
  const s = useSubject(a.subject_id);
  const next = (e) => { e.stopPropagation(); save('assignments', { ...a, status: ASG[(ASG.indexOf(a.status) + 1) % 3] }); };
  return (
    <li className="it" onClick={() => openForm('assignments', a)}>
      <span className="bar" style={{ background: s.color }} />
      <div className="tx">
        <b>{a.title}</b>
        <small>{s.name} · due {fmt(a.due_date)} ({cd(a.due_date)})</small>
        {full && a.description && <p>{a.description}</p>}
      </div>
      <button className={`chip ${ST[a.status]}`} onClick={next} aria-label={`Status: ${a.status}. Change status`}>{a.status}</button>
    </li>
  );
}

export function ExamRow({ e }) {
  const { openForm } = useStore();
  const s = useSubject(e.subject_id);
  return (
    <li className="it" onClick={() => openForm('exams', e)}>
      <span className="bar" style={{ background: s.color }} />
      <div className="tx"><b>{e.title}</b><small>{s.name} · {fmt(e.exam_date)}</small></div>
      <span className="cd">{left(e.exam_date) < 0 ? '–' : left(e.exam_date) + 'd'}</span>
    </li>
  );
}

export function ExamCard({ e }) {
  const { openForm, save } = useStore();
  const s = useSubject(e.subject_id);
  const n = left(e.exam_date);
  const next = (ev) => { ev.stopPropagation(); save('exams', { ...e, prep_status: PREP[(PREP.indexOf(e.prep_status) + 1) % 3] }); };
  return (
    <div className="card exam" style={{ '--c': s.color }} onClick={() => openForm('exams', e)}>
      <div><h3>{e.title}</h3><small className="muted">{s.name} · {fmt(e.exam_date)}</small></div>
      <div className="cd">{n < 0 ? 'Done' : n === 0 ? 'Today' : n + ' days left'}</div>
      <button className={`chip ${ST[e.prep_status]}`} onClick={next} aria-label={`Preparation: ${e.prep_status}. Change`}>{e.prep_status}</button>
    </div>
  );
}

export function Session({ x, timeOnly }) {
  const { openForm, save } = useStore();
  const s = useSubject(x.subject_id);
  return (
    <div className={`ses ${x.completed ? 'done' : ''}`} style={{ '--c': s.color }} onClick={() => openForm('sessions', x)}>
      <input type="checkbox" className="tick" checked={x.completed} aria-label="Mark session done"
        onClick={(e) => e.stopPropagation()} onChange={(e) => save('sessions', { ...x, completed: e.target.checked })} />
      <div><b>{x.topic || s.name}</b><small>{x.start_time.slice(0, 5)}–{x.end_time.slice(0, 5)}</small>{!timeOnly && <small>{s.name}</small>}</div>
    </div>
  );
}
