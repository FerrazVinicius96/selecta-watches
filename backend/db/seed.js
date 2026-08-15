// Seed idempotente: popula relógios placeholder e o admin padrão, sem duplicar
// em execuções repetidas (usa ON CONFLICT / verificação prévia).
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../src/db/pool');

// Catálogo real fornecido pelo PO (fotos e dados próprios da Selecta
// Watches) — substitui os placeholders usados no Ciclo 1.
const REAL_WATCHES = [
  {
    name: 'Diagono Chrono',
    brand: 'Bvlgari',
    description: '38mm · Ref. AC38TA',
    price: 15000.0,
    image_url: '/images/watches/bvlgari-diagono-chrono.png',
    featured: true,
    active: true,
  },
  {
    name: 'Submariner Kermit',
    brand: 'Rolex',
    description: '40mm · Ref. 16610LV · Fullset 2008 · Sob encomenda',
    price: null,
    image_url: '/images/watches/rolex-submariner-kermit.png',
    featured: true,
    active: true,
  },
  {
    name: 'Black Bay Panda',
    brand: 'Tudor',
    description: '41mm · Ref. M79360N · Completo 2024',
    price: 32000.0,
    image_url: '/images/watches/tudor-black-bay-panda.png',
    featured: true,
    active: true,
  },
];

async function seedWatches(client) {
  const { rows } = await client.query('SELECT COUNT(*)::int AS count FROM watches');
  if (rows[0].count > 0) {
    console.log('[seed] tabela watches já populada, pulando.');
    return;
  }

  for (const watch of REAL_WATCHES) {
    await client.query(
      `INSERT INTO watches (name, brand, description, price, image_url, featured, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        watch.name,
        watch.brand,
        watch.description,
        watch.price,
        watch.image_url,
        watch.featured,
        watch.active,
      ]
    );
  }
  console.log(`[seed] ${REAL_WATCHES.length} relógios inseridos.`);
}

async function seedAdmin(client) {
  const username = process.env.SEED_ADMIN_USERNAME || 'admin';
  const password = process.env.SEED_ADMIN_PASSWORD || 'selecta2026';

  const existing = await client.query('SELECT id FROM admins WHERE username = $1', [username]);
  if (existing.rows.length > 0) {
    console.log(`[seed] admin "${username}" já existe, pulando.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await client.query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', [
    username,
    passwordHash,
  ]);
  console.log(`[seed] admin padrão criado -> usuário: "${username}", senha: "${password}"`);
  console.log('[seed] IMPORTANTE: troque essa senha em produção.');
}

async function runSeed() {
  const client = await pool.connect();
  try {
    await seedWatches(client);
    await seedAdmin(client);
    console.log('[seed] concluído.');
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed().catch((err) => {
  console.error('[seed] falhou:', err);
  process.exit(1);
});
