const fs = require('fs');
const path = require('path');
const db = require('./db');

// Creates any missing tables so a fresh database works without running SQL by hand.
module.exports = async () => {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await db.query(sql);
};
