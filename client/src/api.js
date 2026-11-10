const BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

export const token = {
  get: () => localStorage.getItem('ss_token'),
  set: (t) => localStorage.setItem('ss_token', t),
  clear: () => localStorage.removeItem('ss_token'),
};

const fail = (message, status) => Object.assign(new Error(message), { status });

export async function api(path, method = 'GET', body) {
  const headers = { 'Content-Type': 'application/json' };
  if (token.get()) headers.Authorization = 'Bearer ' + token.get();
  let res;
  try {
    res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch (e) {
    console.error('Could not reach the API at', BASE, e);
    throw fail("Can't reach the server. Check your connection and try again.");
  }
  if (res.status === 401 && token.get()) { token.clear(); location.reload(); }
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    if (data && data.error) throw fail(data.error, res.status);
    // An HTML 404/405 means the request never reached the StudySpace API
    if (res.status === 404 || res.status === 405) {
      console.error('No API at', BASE, '- set VITE_API_URL when building the client.');
      throw fail("The app can't find its server. Please try again later.", res.status);
    }
    throw fail('Something went wrong. Please try again.', res.status);
  }
  return data;
}
