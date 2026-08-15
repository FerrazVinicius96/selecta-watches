// Middleware central de erros: converte HttpError (validação/negócio) em
// respostas previsíveis e evita vazar stack traces de erros inesperados.
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || 500;

  if (statusCode === 500) {
    console.error('Erro inesperado:', err);
  }

  res.status(statusCode).json({
    error: statusCode === 500 ? 'Erro interno do servidor.' : err.message,
  });
}

module.exports = { errorHandler };
