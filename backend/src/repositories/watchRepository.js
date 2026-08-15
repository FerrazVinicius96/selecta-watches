// Acesso direto à tabela watches. SQL puro e parametrizado, sem ORM.
// Cada método usa o pool diretamente (sem transação implícita) para não
// atrapalhar caso um ciclo futuro precise compor múltiplas queries em uma
// mesma transação no service.
const { pool } = require('../db/pool');

const PUBLIC_COLUMNS = 'id, name, brand, description, price, image_url, featured, active, created_at, updated_at';

async function findPublic({ featuredOnly } = {}) {
  const conditions = ['active = TRUE'];
  const params = [];

  if (featuredOnly) {
    conditions.push('featured = TRUE');
  }

  const query = `
    SELECT ${PUBLIC_COLUMNS}
    FROM watches
    WHERE ${conditions.join(' AND ')}
    ORDER BY featured DESC, created_at DESC
  `;

  const { rows } = await pool.query(query, params);
  return rows;
}

async function findAll() {
  const { rows } = await pool.query(
    `SELECT ${PUBLIC_COLUMNS} FROM watches ORDER BY created_at DESC`
  );
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query(`SELECT ${PUBLIC_COLUMNS} FROM watches WHERE id = $1`, [id]);
  return rows[0] || null;
}

async function create(watch) {
  const { rows } = await pool.query(
    `INSERT INTO watches (name, brand, description, price, image_url, featured, active)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING ${PUBLIC_COLUMNS}`,
    [
      watch.name,
      watch.brand,
      watch.description ?? null,
      watch.price,
      watch.image_url ?? null,
      watch.featured ?? false,
      watch.active ?? true,
    ]
  );
  return rows[0];
}

async function update(id, watch) {
  const { rows } = await pool.query(
    `UPDATE watches
     SET name = $1,
         brand = $2,
         description = $3,
         price = $4,
         image_url = $5,
         featured = $6,
         active = $7,
         updated_at = NOW()
     WHERE id = $8
     RETURNING ${PUBLIC_COLUMNS}`,
    [
      watch.name,
      watch.brand,
      watch.description ?? null,
      watch.price,
      watch.image_url ?? null,
      watch.featured ?? false,
      watch.active ?? true,
      id,
    ]
  );
  return rows[0] || null;
}

async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM watches WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = { findPublic, findAll, findById, create, update, remove };
