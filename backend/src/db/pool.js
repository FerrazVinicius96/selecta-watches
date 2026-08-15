const { Pool } = require('pg');

// Pool único de conexões com o Postgres, reaproveitado por todos os repositories.
// connectionString vem de DATABASE_URL (.env) — ver .env.example.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  // Erros em clientes ociosos do pool não devem derrubar o processo,
  // mas precisam ser visíveis nos logs.
  console.error('Erro inesperado no pool do Postgres:', err);
});

module.exports = { pool };
