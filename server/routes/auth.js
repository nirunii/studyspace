const router = require('express').Router();
const bcrypt = require('bcryptjs'); // pure JavaScript: installs everywhere, no build tools needed
const jwt = require('jsonwebtoken');
const db = require('../db');
const auth = require('../middleware/auth');

const sign = (u) => jwt.sign({ id: u.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const pub = (u) => ({ id: u.id, name: u.name, email: u.email });
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v) => (typeof v === 'string' ? v : '');
const bad = (res, msg) => res.status(400).json({ error: msg });

router.post('/register', async (req, res, next) => {
  try {
    const name = str(req.body.name).trim();
    const email = str(req.body.email).trim().toLowerCase();
    const password = str(req.body.password);
    if (!name) return bad(res, 'Please enter your name');
    if (name.length > 80) return bad(res, 'Name must be 80 characters or fewer');
    if (!EMAIL.test(email) || email.length > 120) return bad(res, 'Please enter a valid email address');
    if (password.length < 6) return bad(res, 'Password must be at least 6 characters');
    if (password.length > 72) return bad(res, 'Password must be 72 characters or fewer');

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hash]
    );
    res.status(201).json({ token: sign(rows[0]), user: pub(rows[0]) });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'That email is already registered. Try logging in instead.' });
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = str(req.body.email).trim().toLowerCase();
    const password = str(req.body.password);
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const u = rows[0];
    if (!u || !(await bcrypt.compare(password, u.password_hash))) {
      return res.status(401).json({ error: 'Wrong email or password' });
    }
    res.json({ token: sign(u), user: pub(u) });
  } catch (e) { next(e); }
});

router.get('/me', auth, async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (!rows[0]) return res.status(401).json({ error: 'Please log in' });
    res.json(pub(rows[0]));
  } catch (e) { next(e); }
});

module.exports = router;
