-- Leads capturados pelo formulário público ("solicitar catálogo" / "falar com especialista").
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  contact VARCHAR(150) NOT NULL, -- e-mail ou telefone informado pelo lead
  interest TEXT,                 -- mensagem/relógio de interesse (opcional)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
