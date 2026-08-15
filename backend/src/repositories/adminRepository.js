// Acesso direto à tabela admins. SQL puro e parametrizado, sem ORM.
const { pool } = require('../db/pool');

async function findByUsername(username) {
  const { rows } = await pool.query(
    'SELECT id, username, password_hash FROM admins WHERE username = $1',
    [username]
  );
  return rows[0] || null;
}

module.exports = { findByUsername };
