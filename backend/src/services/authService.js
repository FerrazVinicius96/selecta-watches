// Autenticação simples de admin: valida credenciais contra o hash bcrypt e
// emite um JWT. Sem refresh token/roles neste ciclo — só existe um perfil
// de admin, então JWT com expiração curta/média já cobre a necessidade.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminRepository = require('../repositories/adminRepository');
const { HttpError } = require('../utils/httpError');

async function login(username, password) {
  if (!username || !password) {
    throw new HttpError(400, 'username e password são obrigatórios.');
  }

  const admin = await adminRepository.findByUsername(username);
  if (!admin) {
    throw new HttpError(401, 'Credenciais inválidas.');
  }

  const passwordMatches = await bcrypt.compare(password, admin.password_hash);
  if (!passwordMatches) {
    throw new HttpError(401, 'Credenciais inválidas.');
  }

  const token = jwt.sign({ sub: admin.id, username: admin.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });

  return { token, admin: { id: admin.id, username: admin.username } };
}

module.exports = { login };
