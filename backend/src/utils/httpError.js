// Erro simples com status HTTP embutido, usado pelos services para
// sinalizar falhas de validação/autenticação sem acoplar a camada de
// controller a detalhes internos.
class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = { HttpError };
