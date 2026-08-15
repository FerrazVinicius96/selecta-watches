// Regras de negócio do catálogo: validação de payload e orquestração do
// repository. Mantido simples de propósito — sem regras de estoque/preço
// dinâmico neste ciclo (não há e-commerce completo).
const watchRepository = require('../repositories/watchRepository');
const { HttpError } = require('../utils/httpError');

function validateWatchPayload(payload, { partial = false } = {}) {
  const errors = [];

  if (!partial || payload.name !== undefined) {
    if (!payload.name || typeof payload.name !== 'string' || !payload.name.trim()) {
      errors.push('name é obrigatório.');
    }
  }

  if (!partial || payload.brand !== undefined) {
    if (!payload.brand || typeof payload.brand !== 'string' || !payload.brand.trim()) {
      errors.push('brand é obrigatório.');
    }
  }

  if ((!partial || payload.price !== undefined) && payload.price !== null) {
    const price = Number(payload.price);
    if (Number.isNaN(price) || price < 0) {
      errors.push('price deve ser um número maior ou igual a zero (ou null para "sob encomenda").');
    }
  }

  if (errors.length > 0) {
    throw new HttpError(400, errors.join(' '));
  }
}

async function getPublicCatalog({ featured } = {}) {
  const featuredOnly = featured === 'true' || featured === true;
  return watchRepository.findPublic({ featuredOnly });
}

async function getAllForAdmin() {
  return watchRepository.findAll();
}

async function getById(id) {
  const watch = await watchRepository.findById(id);
  if (!watch) {
    throw new HttpError(404, 'Relógio não encontrado.');
  }
  return watch;
}

async function createWatch(payload) {
  validateWatchPayload(payload);
  return watchRepository.create(payload);
}

async function updateWatch(id, payload) {
  await getById(id); // garante existência antes de tentar atualizar
  validateWatchPayload(payload);
  return watchRepository.update(id, payload);
}

async function deleteWatch(id) {
  await getById(id);
  await watchRepository.remove(id);
}

module.exports = {
  getPublicCatalog,
  getAllForAdmin,
  getById,
  createWatch,
  updateWatch,
  deleteWatch,
};
