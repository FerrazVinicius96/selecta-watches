const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/**
 * O PostgreSQL devolve NUMERIC como string (para não perder precisão), então
 * a conversão acontece aqui, na borda de apresentação.
 */
export function formatPrice(value) {
  if (value === null || value === undefined || value === '') return 'Sob consulta'
  const n = Number(value)
  if (!Number.isFinite(n)) return 'Sob consulta'
  return BRL.format(n)
}
