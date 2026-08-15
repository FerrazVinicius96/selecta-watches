const { Pool } = require('pg');

// SSL obrigatório fora do ambiente local: o Supabase (e a maioria dos
// provedores gerenciados) exige conexão criptografada. rejectUnauthorized:
// false porque o certificado do pooler do Supabase não está na cadeia de
// confiança padrão do Node — aceitável aqui pois a autenticação real já
// acontece via usuário/senha na própria connection string.
const isLocalDb = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL || '');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: isLocalDb ? false : { rejectUnauthorized: false },
});

pool.on('error', (err) => {
	// Erros em clientes ociosos do pool não devem derrubar o processo,
	// mas precisam ser visíveis nos logs.
	console.error('Erro inesperado no pool do Postgres:', err);
});

module.exports = { pool };
