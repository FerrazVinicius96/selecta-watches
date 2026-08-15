-- Peças "sob encomenda" ainda não têm preço fechado — price passa a aceitar
-- NULL (mantendo a validação de não-negativo quando preenchido). A ausência
-- de preço vira "Sob consulta" na apresentação (frontend/admin).
ALTER TABLE watches ALTER COLUMN price DROP NOT NULL;
