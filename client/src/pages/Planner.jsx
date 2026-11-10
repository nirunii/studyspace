import { useState } from 'react';
import { useStore } from '../store';
import { Head, Session } from '../Components';
import Icon from '../icons';
import { TODAY, addDays, byTime, fmt, wkDays } from '../util';

const NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Planner() {
  const { sessions, openForm } = useStore();
  const [off, setOff] = useState(0);
  const wk = wkDays(addDays(off * 7));
  return (
    <section>
      <Head title="Study planner" sub={`${fmt(wk[0])} – ${fmt(wk[6])}`} onAdd={() => openForm('sessions')} label="Add session" />
      <div className="wkctl">
        <button className="btn alt" onClick={() => setOff(off - 1)}><Icon name="left" size={16} />Previous</button>
        <button className="btn alt" onClick={() => setOff(0)}>This week</button>
        <button className="btn alt" onClick={() => setOff(off + 1)}>Next<Icon name="right" size={16} /></button>
      </div>
      <div className="wk">
        {wk.map((d, i) => {
          const list = sessions.filter((s) => s.session_date === d).sort(byTime);
          return (
            <div key={d} className={`day ${d === TODAY ? 'today' : ''}`}>
              <h3>{NAMES[i]} {new Date(d + 'T00:00').getDate()}</h3>
              {list.length ? list.map((x) => <Session key={x.id} x={x} />) : <small className="muted">Free</small>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
