-- Catálogo de relógios exibido na landing page e gerido pelo painel admin.
CREATE TABLE IF NOT EXISTS watches (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para acelerar a query pública mais comum: catálogo ativo em destaque.
CREATE INDEX IF NOT EXISTS idx_watches_active_featured ON watches (active, featured);
