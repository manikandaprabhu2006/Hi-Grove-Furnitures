/**
 * DEMO ADMIN AUTH — UI-level only.
 * This does NOT verify credentials. It exists so the admin screens can be built and reviewed.
 * Before going live, replace signIn/signOut/getSession with calls to a real backend that issues an
 * httpOnly, secure, same-site session cookie (or a short-lived JWT held in memory), and enforce
 * authorisation on the server for every /api/admin/* route. Passwords are never stored client-side.
 */
const KEY = 'hgf:admin-session';

export function getSession() {
  try {
    const s = sessionStorage.getItem(KEY) || localStorage.getItem(KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export async function signIn({ email, password, remember }) {
  if (!/^\S+@\S+\.\S+$/.test(email || '')) throw new Error('Enter a valid email address.');
  if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.');
  // Only non-secret data is kept: the email and a demo flag. The password is discarded here.
  const session = { email, role: 'admin', demo: true, at: Date.now() };
  sessionStorage.setItem(KEY, JSON.stringify(session));
  if (remember) localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function signOut() {
  sessionStorage.removeItem(KEY);
  localStorage.removeItem(KEY);
}
