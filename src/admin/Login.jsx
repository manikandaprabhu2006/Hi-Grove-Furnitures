import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from '../services/auth';
import SEO from '../components/SEO';

export default function Login() {
  const nav = useNavigate();
  const { state } = useLocation();
  const [f, setF] = useState({ email: '', password: '', remember: false });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [forgot, setForgot] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { await signIn(f); nav(state?.from || '/admin', { replace: true }); } catch (x) { setErr(x.message); setBusy(false); }
  };
  return (
    <div className="login grain-bg">
      <SEO title="Admin Sign In" description="Admin sign in" noindex />
      <form className="login__card" onSubmit={submit} noValidate>
        <img src="/brand/logo-full-sm.webp" alt="Hi Grove Furnitures" width="200" height="157" />
        <h1>Admin sign in</h1>
        <p className="login__demo">Demo mode: any valid email and a password of 6+ characters opens the dashboard. Real authentication needs a backend.</p>
        <div className="afield"><label htmlFor="em">Email</label><input id="em" type="email" autoComplete="username" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        <div className="afield"><label htmlFor="pw">Password</label>
          <span className="pwrap"><input id="pw" type={show ? 'text' : 'password'} autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /><button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></div>
        <div className="login__row"><label className="atog"><input type="checkbox" checked={f.remember} onChange={(e) => setF({ ...f, remember: e.target.checked })} /><span>Remember me</span></label><button type="button" className="link" onClick={() => setForgot(!forgot)}>Forgot password?</button></div>
        {forgot && <p className="login__demo">Password reset needs a backend email service. It is not connected in this demo.</p>}
        {err && <p className="error" role="alert">{err}</p>}
        <button className="btn btn--gold btn--block" disabled={busy}>SIGN IN</button>
      </form>
    </div>
  );
}
