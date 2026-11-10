const express = require('express');
const db = require('../db');

// Builds list / create / update / delete routes for one table.
// Every query is limited to the logged-in user (user_id), so students
// can only ever see and change their own records.
module.exports = (table, cols, order) => {
  const r = express.Router();

  // Make sure a referenced subject belongs to this user
  const ownsSubject = async (req, res, next) => {
    try {
      const sid = req.body.subject_id;
      if (sid != null) {
        const { rowCount } = await db.query('SELECT 1 FROM subjects WHERE id = $1 AND user_id = $2', [sid, req.user.id]);
        if (!rowCount) return res.status(400).json({ error: 'Unknown subject' });
      }
      next();
    } catch (e) { next(e); }
  };

  r.get('/', async (req, res, next) => {
    try {
      const { rows } = await db.query(`SELECT * FROM ${table} WHERE user_id = $1 ORDER BY ${order}`, [req.user.id]);
      res.json(rows);
    } catch (e) { next(e); }
  });

  r.post('/', ownsSubject, async (req, res, next) => {
    try {
      const vals = cols.map((c) => req.body[c] ?? null);
      const marks = cols.map((_, i) => `$${i + 2}`).join(',');
      const { rows } = await db.query(
        `INSERT INTO ${table} (user_id, ${cols.join(',')}) VALUES ($1, ${marks}) RETURNING *`,
        [req.user.id, ...vals]
      );
      res.status(201).json(rows[0]);
    } catch (e) { next(e); }
  });

  r.put('/:id', ownsSubject, async (req, res, next) => {
    try {
      const vals = cols.map((c) => req.body[c] ?? null);
      const sets = cols.map((c, i) => `${c} = COALESCE($${i + 3}, ${c})`).join(',');
      const { rows } = await db.query(
        `UPDATE ${table} SET ${sets} WHERE id = $1 AND user_id = $2 RETURNING *`,
        [req.params.id, req.user.id, ...vals]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Not found' });
      res.json(rows[0]);
    } catch (e) { next(e); }
  });

  r.delete('/:id', async (req, res, next) => {
    try {
      await db.query(`DELETE FROM ${table} WHERE id = $1 AND user_id = $2`, [req.params.id, req.user.id]);
      res.sendStatus(204);
    } catch (e) { next(e); }
  });

  return r;
};
