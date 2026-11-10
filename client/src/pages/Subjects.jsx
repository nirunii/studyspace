import { useStore } from '../store';
import { Head } from '../Components';

export default function Subjects() {
  const { subjects, openForm } = useStore();
  return (
    <section>
      <Head title="Subjects" sub="Everything you’re studying this semester." onAdd={() => openForm('subjects')} label="Add subject" />
      {subjects.length ? (
        <div className="subs">
          {subjects.map((s) => (
            <div key={s.id} className="card subc" style={{ '--c': s.color }} onClick={() => openForm('subjects', s)}>
              <span className="code">{s.code || 'No code'}</span>
              <h3>{s.name}</h3>
              <small>{s.lecturer || 'No lecturer added'}</small>
            </div>
          ))}
        </div>
      ) : <div className="card empty">No subjects yet. Add your first one to get started.</div>}
    </section>
  );
}
