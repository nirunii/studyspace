import { useStore } from '../store';
import { AsgItem, ExamRow, Head, Session, Stat } from '../Components';
import { TODAY, byTime, hrs, left, pct, wkDays } from '../util';

export default function Dashboard({ user }) {
  const { subjects, assignments, sessions, exams } = useStore();
  const wk = wkDays(TODAY);
  const pw = sessions.filter((s) => wk.includes(s.session_date));
  const dn = pw.filter((s) => s.completed);
  const up = assignments.filter((a) => a.status !== 'Completed').sort((a, b) => (a.due_date > b.due_date ? 1 : -1)).slice(0, 4);
  const ex = exams.filter((e) => left(e.exam_date) >= 0).sort((a, b) => (a.exam_date > b.exam_date ? 1 : -1));
  const td = sessions.filter((s) => s.session_date === TODAY).sort(byTime);
  const h = new Date().getHours();
  const p = pct(dn.length, pw.length);

  return (
    <section>
      <Head title={user ? `${h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'}, ${user.name.split(' ')[0]}` : 'Welcome to StudySpace'}
        sub={new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })} />
      <div className="grid">
        <Stat i="book" n={subjects.length} l="Subjects" tone="green" />
        <Stat i="tasks" n={assignments.filter((a) => a.status !== 'Completed').length} l="Open assignments" tone="amber" />
        <Stat i="target" n={ex.length} l="Upcoming exams" tone="red" />
        <Stat i="clock" n={td.length} l="Study sessions today" tone="blue" />
      </div>
      <div className="grid two">
        <div className="card"><h2>Today’s study tasks</h2>
          {td.length ? td.map((x) => <Session key={x.id} x={x} timeOnly />) : <p className="empty">No sessions today. Add one in the planner.</p>}
        </div>
        <div className="card"><h2>Weekly study progress</h2>
          <div className="num big">{p}%</div>
          <p className="sub" style={{ margin: '0 0 12px' }}>{dn.length} of {pw.length} sessions done · {+dn.reduce((a, s) => a + hrs(s), 0).toFixed(1)} hours studied</p>
          <div className="prog"><i style={{ width: p + '%' }} /></div>
        </div>
      </div>
      <div className="grid two">
        <div className="card"><h2>Upcoming assignments</h2>
          <ul>{up.length ? up.map((a) => <AsgItem key={a.id} a={a} />) : <li className="empty">You’re all caught up.</li>}</ul>
        </div>
        <div className="card"><h2>Upcoming exams</h2>
          <ul>{ex.length ? ex.slice(0, 3).map((e) => <ExamRow key={e.id} e={e} />) : <li className="empty">No exams coming up.</li>}</ul>
        </div>
      </div>
    </section>
  );
}
