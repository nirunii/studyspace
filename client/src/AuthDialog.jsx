import { useEffect, useRef, useState } from 'react';
import { api } from './api';
import Icon, { Logo } from './icons';

export default function AuthDialog({ mode: start, reason, onAuth, onClose }) {
  const ref = useRef();
  const [mode, setMode] = useState(start);
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const signup = mode === 'signup';
  const set = (k) => (e) => setF((o) => ({ ...o, [k]: e.target.value }));

  useEffect(() => { if (!ref.current.open) ref.current.showModal(); }, []);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try {
      const body = signup
        ? { name: f.name.trim(), email: f.email.trim(), password: f.password }
        : { email: f.email.trim(), password: f.password };
      const r = await api(signup ? '/auth/register' : '/auth/login', 'POST', body);
      onAuth(r.token, r.user);
    } catch (x) { setErr(x.message); setBusy(false); }
  };
  const swap = () => { setMode(signup ? 'login' : 'signup'); setErr(''); };

  return (
    <dialog ref={ref} className="authdlg" onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <form onSubmit={submit} noValidate={false}>
        <button type="button" className="x" onClick={onClose} aria-label="Close"><Icon name="x" size={18} /></button>
        <Logo size={40} />
        <h2>{signup ? 'Create your account' : 'Welcome back'}</h2>
        <p className="sub">{reason || (signup ? 'Free, and takes less than a minute.' : 'Log in to see your own study space.')}</p>
        {signup && (
          <label>Full name
            <input type="text" autoComplete="name" value={f.name} onChange={set('name')} maxLength={80} required autoFocus />
          </label>
        )}
        <label>Email
          <input type="email" autoComplete="email" value={f.email} onChange={set('email')} required autoFocus={!signup} />
        </label>
        <label>Password
          <span className="pw">
            <input type={show ? 'text' : 'password'} autoComplete={signup ? 'new-password' : 'current-password'}
              value={f.password} onChange={set('password')} minLength={6} maxLength={72} required />
            <button type="button" className="linkbtn" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>
          </span>
          {signup && <small className="muted">At least 6 characters</small>}
        </label>
        {err && <p className="err" role="alert">{err}</p>}
        <button className="btn wide" disabled={busy}>{busy ? 'Please wait…' : signup ? 'Create account' : 'Log in'}</button>
        <p className="swap">
          {signup ? 'Already have an account?' : 'New to StudySpace?'}{' '}
          <button type="button" className="linkbtn" onClick={swap}>{signup ? 'Log in' : 'Create an account'}</button>
        </p>
      </form>
    </dialog>
  );
}
