// Acesso direto à tabela leads. SQL puro e parametrizado, sem ORM.
const { pool } = require('../db/pool');

async function create(lead) {
  const { rows } = await pool.query(
    `INSERT INTO leads (name, contact, interest)
     VALUES ($1, $2, $3)
     RETURNING id, name, contact, interest, created_at`,
    [lead.name, lead.contact, lead.interest ?? null]
  );
  return rows[0];
}

async function findAll() {
  const { rows } = await pool.query(
    'SELECT id, name, contact, interest, created_at FROM leads ORDER BY created_at DESC'
  );
  return rows;
}

module.exports = { create, findAll };
