require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const migrate = require('./migrate');
const auth = require('./middleware/auth');
const crud = require('./routes/crud');

if (!process.env.JWT_SECRET) {
  console.error('\nJWT_SECRET is not set. Copy .env.example to .env and set JWT_SECRET to any long random text.\n');
  process.exit(1);
}

// CLIENT_URL may hold several addresses separated by commas. Only the origin
// (scheme + host) matters, so a trailing slash or path is ignored.
const toOrigin = (s) => { try { return new URL(s).origin; } catch { return s.replace(/\/+$/, ''); } };
const allowed = (process.env.CLIENT_URL || '').split(',').map((s) => s.trim()).filter(Boolean).map(toOrigin);
const isLocal = (o) => /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o);

const app = express();
app.use(cors({ origin: (origin, cb) => cb(null, !origin || !allowed.length || allowed.includes(origin) || isLocal(origin)) }));
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try { await db.query('SELECT 1'); res.json({ ok: true, db: true }); }
  catch { res.status(503).json({ ok: false, db: false }); }
});
app.use('/api/auth', require('./routes/auth'));
app.use('/api/subjects', auth, crud('subjects', ['name', 'code', 'lecturer', 'color'], 'name'));
app.use('/api/assignments', auth, crud('assignments', ['subject_id', 'title', 'description', 'due_date', 'status'], 'due_date'));
app.use('/api/sessions', auth, crud('study_sessions', ['subject_id', 'topic', 'session_date', 'start_time', 'end_time', 'completed'], 'session_date, start_time'));
app.use('/api/exams', auth, crud('exams', ['subject_id', 'title', 'exam_date', 'prep_status'], 'exam_date'));

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

const DB_DOWN = ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', 'ECONNRESET', '28P01', '28000', '3D000', '57P03'];
app.use((err, req, res, next) => {
  console.error(err);
  const code = String(err.code || '');
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid request' });
  if (/^2[23]/.test(code)) return res.status(400).json({ error: 'Invalid or missing data' });
  if (DB_DOWN.includes(code) || /^08/.test(code)) {
    return res.status(503).json({ error: 'The server cannot reach its database right now. Please try again in a moment.' });
  }
  res.status(500).json({ error: 'Server error' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log('StudySpace API running on port ' + port));

// Create tables if they are missing. If the database is unreachable the server
// stays up and /api/health reports it, so the problem is visible instead of silent.
migrate()
  .then(() => console.log('Database ready'))
  .catch((e) => console.error('\nDatabase set-up failed: ' + (e.message || e.code) + '\nCheck DATABASE_URL in server/.env (password, host and database name).\n'));
