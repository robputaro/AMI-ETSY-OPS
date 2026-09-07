import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE = 'ami_ops_session';

function sign(value) {
  return crypto.createHmac('sha256', process.env.SESSION_SECRET || 'dev-secret').update(value).digest('hex');
}

export async function isAuthed() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value || '';
  const [value, sig] = token.split('.');
  if (!value || !sig) return false;
  const expected = sign(value);
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch { return false; }
}

export async function setSession() {
  const store = await cookies();
  const value = `${Date.now()}`;
  store.set(COOKIE, `${value}.${sign(value)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE);
}
