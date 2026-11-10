import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useStore } from '../store';
import { Head, Stat } from '../Components';
import { TODAY, addDays, fmt, hrs, pct, wkDays } from '../util';

const Chart = ({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <BarChart data={data}>
      <CartesianGrid stroke="var(--line)" vertical={false} />
      <XAxis dataKey="label" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
      <YAxis allowDecimals={false} unit="h" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
      <Tooltip cursor={{ fill: 'var(--hover)' }} formatter={(v) => [v + ' h', 'Studied']}
        contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8, color: 'var(--ink)' }} />
      <Bar dataKey="hours" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={44} />
    </BarChart>
  </ResponsiveContainer>
);

export default function Progress() {
  const { subjects, assignments, sessions, exams } = useStore();
  const done = sessions.filter((s) => s.completed);
  const hoursOn = (days) => +done.filter((s) => days.includes(s.session_date)).reduce((a, s) => a + hrs(s), 0).toFixed(1);
  const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const week = wkDays(TODAY).map((d, i) => ({ label: names[i], hours: hoursOn([d]) }));
  const month = [3, 2, 1, 0].map((k) => { const w = wkDays(addDays(-7 * k)); return { label: 'Wk of ' + fmt(w[0]), hours: hoursOn(w) }; });
  const ac = assignments.filter((a) => a.status === 'Completed').length;

  return (
    <section>
      <Head title="Progress" sub="See how your study habits are growing." />
      <div className="grid">
        <Stat i="check" n={done.length} l="Sessions completed" tone="green" />
        <Stat i="tasks" n={pct(ac, assignments.length) + '%'} l="Assignments completed" tone="amber" />
        <Stat i="clock" n={week.reduce((a, x) => a + x.hours, 0).toFixed(1)} l="Hours this week" tone="blue" />
        <Stat i="target" n={`${exams.filter((e) => e.prep_status === 'Ready').length}/${exams.length}`} l="Exams ready" tone="red" />
      </div>
      <div className="grid two">
        <div className="card"><h2>Study hours this week</h2><Chart data={week} /></div>
        <div className="card"><h2>Monthly productivity</h2><Chart data={month} /><p className="sub" style={{ margin: '8px 0 0' }}>Study hours per week, last 4 weeks.</p></div>
      </div>
      <div className="card"><h2>Subject progress</h2>
        {subjects.length ? subjects.map((s) => {
          const ts = sessions.filter((x) => x.subject_id === s.id), ta = assignments.filter((x) => x.subject_id === s.id);
          const d = ts.filter((x) => x.completed).length + ta.filter((x) => x.status === 'Completed').length, t = ts.length + ta.length;
          return (
            <div className="spr" key={s.id}>
              <div><span>{s.name}</span><span>{d} of {t} done</span></div>
              <div className="prog"><i style={{ width: pct(d, t) + '%', background: s.color }} /></div>
            </div>
          );
        }) : <p className="empty">Add a subject to see progress.</p>}
      </div>
    </section>
  );
}
