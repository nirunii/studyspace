import { useStore } from '../store';
import { AsgItem, Head } from '../Components';

export default function Assignments() {
  const { assignments, openForm } = useStore();
  const l = [...assignments].sort((a, b) => (a.status === 'Completed') - (b.status === 'Completed') || (a.due_date > b.due_date ? 1 : -1));
  return (
    <section>
      <Head title="Assignments" sub="Tap a status to move it along: Pending, In Progress, Completed." onAdd={() => openForm('assignments')} label="Add assignment" />
      <div className="card"><ul>{l.length ? l.map((a) => <AsgItem key={a.id} a={a} full />) : <li className="empty">No assignments yet.</li>}</ul></div>
    </section>
  );
}
