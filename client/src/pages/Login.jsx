import { useState } from 'react';
import { api } from '../api';

export default function Login({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try { const r = await api(`/auth/${mode}`, 'POST', f); onAuth(r.token, r.user); }
    catch (x) { setErr(x.message); setBusy(false); }
  };

  return (
    <div className="auth">
      <form className="card" onSubmit={submit}>
        <div className="brand" style={{ margin: 0 }}><b>S</b>StudySpace</div>
        <h1>{mode === 'login' ? 'Welcome back 🌿' : 'Create your account'}</h1>
        {mode === 'register' && <label>Your name<input type="text" value={f.name} onChange={set('name')} required /></label>}
        <label>Email<input type="email" value={f.email} onChange={set('email')} required /></label>
        <label>Password<input type="password" value={f.password} onChange={set('password')} minLength={6} required /></label>
        {err && <p className="err">{err}</p>}
        <button className="btn" disabled={busy}>{mode === 'login' ? 'Log in' : 'Sign up'}</button>
        <p className="sub" style={{ margin: 0, textAlign: 'center' }}>
          {mode === 'login' ? 'New here? ' : 'Already have an account? '}
          <button type="button" className="linkbtn" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }}>
            {mode === 'login' ? 'Create an account' : 'Log in'}
          </button>
        </p>
      </form>
    </div>
  );
}
