/**
 * Único ponto de contato do frontend com a API Express.
 * Regra do projeto: o frontend NUNCA acessa o PostgreSQL diretamente — tudo
 * passa por /api. Em dev o Vite faz proxy de /api para localhost:3001.
 */

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    // Falha de rede: API fora do ar, DNS, offline.
    throw new ApiError('Não foi possível conectar ao servidor.', 0)
  }

  if (response.status === 204) return null

  const raw = await response.text()
  let data = null
  if (raw) {
    try {
      data = JSON.parse(raw)
    } catch {
      data = null
    }
  }

  if (!response.ok) {
    throw new ApiError(
      data?.error || data?.message || 'Ocorreu um erro inesperado.',
      response.status
    )
  }

  return data
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** GET /api/watches?featured=true — catálogo em destaque. */
export function fetchFeaturedWatches() {
  return request('/watches?featured=true')
}

/** POST /api/leads — { name, contact, interest } */
export function createLead(payload) {
  return request('/leads', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
