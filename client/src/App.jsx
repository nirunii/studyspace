import { useEffect, useState } from 'react';
import { api, token } from './api';
import { Store } from './store';
import { Banner } from './Components';
import AuthDialog from './AuthDialog';
import Icon, { Logo } from './icons';
import { initials } from './util';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Assignments from './pages/Assignments';
import Planner from './pages/Planner';
import Exams from './pages/Exams';
import Progress from './pages/Progress';

const VIEWS = { dashboard: Dashboard, subjects: Subjects, assignments: Assignments, planner: Planner, exams: Exams, progress: Progress };
const NAV = [
  ['dashboard', 'dashboard', 'Dashboard'], ['subjects', 'book', 'Subjects'], ['assignments', 'tasks', 'Tasks'],
  ['planner', 'calendar', 'Planner'], ['exams', 'target', 'Exams'], ['progress', 'trend', 'Progress'],
];

function Shell({ user, openAuth, onLogout }) {
  const [v, setV] = useState(location.hash.slice(1) || 'dashboard');
  useEffect(() => {
    const f = () => { setV(location.hash.slice(1) || 'dashboard'); scrollTo(0, 0); };
    addEventListener('hashchange', f);
    return () => removeEventListener('hashchange', f);
  }, []);
  const View = VIEWS[v] || Dashboard;
  const label = (NAV.find((n) => n[0] === v) || NAV[0])[2];
  useEffect(() => { document.title = label + ' · StudySpace'; }, [label]);

  return (
    <Store guest={!user} openAuth={openAuth}>
      <header className="top">
        <div className="brand"><Logo size={30} />StudySpace</div>
        {user
          ? <button className="btn alt sm" onClick={onLogout}>Log out</button>
          : <button className="btn sm" onClick={() => openAuth('login')}>Log in</button>}
      </header>
      <div className="app">
        <aside aria-label="Main">
          <div className="brand"><Logo />StudySpace</div>
          <nav>
            {NAV.map(([id, icon, name]) => (
              <a key={id} href={'#' + id} className={v === id ? 'on' : ''} aria-current={v === id ? 'page' : undefined}>
                <Icon name={icon} />{name}
              </a>
            ))}
          </nav>
          {user ? (
            <div className="acct">
              <div className="me"><span className="avatar">{initials(user.name)}</span><div><b>{user.name}</b><small>{user.email}</small></div></div>
              <button className="out" onClick={onLogout}><Icon name="logout" />Log out</button>
            </div>
          ) : (
            <div className="acct">
              <p><b>Save your progress</b><small>Create a free account to add your own subjects, tasks and exams.</small></p>
              <button className="btn wide" onClick={() => openAuth('signup')}>Sign up free</button>
              <button className="btn alt wide" onClick={() => openAuth('login')}><Icon name="login" size={16} />Log in</button>
            </div>
          )}
        </aside>
        <main>
          <Banner />
          <View user={user} />
        </main>
      </div>
    </Store>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    if (!token.get()) { setReady(true); return; }
    api('/auth/me').then(setUser).catch((e) => { if (e.status === 401) token.clear(); }).finally(() => setReady(true));
  }, []);

  if (!ready) return null;
  const openAuth = (mode = 'login', reason = '') => setAuth({ mode, reason });
  return (
    <>
      <Shell key={user ? user.id : 'guest'} user={user} openAuth={openAuth} onLogout={() => { token.clear(); setUser(null); }} />
      {auth && (
        <AuthDialog mode={auth.mode} reason={auth.reason}
          onAuth={(t, u) => { token.set(t); setUser(u); setAuth(null); }}
          onClose={() => setAuth(null)} />
      )}
    </>
  );
}
