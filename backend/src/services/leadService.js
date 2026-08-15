// Regras de negócio de captura de leads: validação mínima o suficiente para
// evitar lixo no banco, sem fricção para o visitante da landing page.
const leadRepository = require('../repositories/leadRepository');
const { HttpError } = require('../utils/httpError');

function validateLeadPayload(payload) {
  const errors = [];

  if (!payload.name || typeof payload.name !== 'string' || !payload.name.trim()) {
    errors.push('name é obrigatório.');
  }

  if (!payload.contact || typeof payload.contact !== 'string' || !payload.contact.trim()) {
    errors.push('contact é obrigatório (e-mail ou telefone).');
  }

  if (errors.length > 0) {
    throw new HttpError(400, errors.join(' '));
  }
}

async function createLead(payload) {
  validateLeadPayload(payload);
  return leadRepository.create({
    name: payload.name.trim(),
    contact: payload.contact.trim(),
    interest: payload.interest ? String(payload.interest).trim() : null,
  });
}

async function listLeads() {
  return leadRepository.findAll();
}

module.exports = { createLead, listLeads };
