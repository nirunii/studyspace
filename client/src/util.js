export const COL = ['#1B7F5A', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#EF4444'];
export const ST = { Pending: 'p', 'In Progress': 'i', Completed: 'c', 'Not started': 'p', Studying: 'i', Ready: 'c' };
export const ASG = ['Pending', 'In Progress', 'Completed'];
export const PREP = ['Not started', 'Studying', 'Ready'];

export const ymd = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
export const TODAY = ymd(new Date());
export const addDays = (n, base = TODAY) => { const d = new Date(base + 'T00:00'); d.setDate(d.getDate() + n); return ymd(d); };
export const fmt = (d) => new Date(d + 'T00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
export const left = (d) => Math.round((new Date(d + 'T00:00') - new Date(TODAY + 'T00:00')) / 864e5);
export const cd = (d) => { const n = left(d); return n < 0 ? 'passed' : n === 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${n} days`; };
export const t5 = (s) => (s || '').slice(0, 5);
export const hrs = (s) => {
  const [a, b] = t5(s.start_time).split(':'), [c, d] = t5(s.end_time).split(':');
  return Math.max(0, ((+c) * 60 + (+d) - (+a) * 60 - (+b)) / 60);
};
export const wkDays = (base) => {
  const d = new Date(base + 'T00:00'); d.setDate(d.getDate() - (d.getDay() + 6) % 7);
  const mon = ymd(d); return [0, 1, 2, 3, 4, 5, 6].map((i) => addDays(i, mon));
};
export const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
export const byTime = (a, b) => (a.session_date + a.start_time > b.session_date + b.start_time ? 1 : -1);
export const initials = (n) => (n || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
