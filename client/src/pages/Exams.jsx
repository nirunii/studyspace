import { useStore } from '../store';
import { ExamCard, Head } from '../Components';

export default function Exams() {
  const { exams, openForm } = useStore();
  const l = [...exams].sort((a, b) => (a.exam_date > b.exam_date ? 1 : -1));
  return (
    <section>
      <Head title="Exam tracker" sub="Know what’s coming and how ready you are." onAdd={() => openForm('exams')} label="Add exam" />
      {l.length ? l.map((e) => <ExamCard key={e.id} e={e} />) : <div className="card empty">No exams added yet.</div>}
    </section>
  );
}
