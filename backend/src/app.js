// Configuração do Express: middlewares globais, montagem das rotas e
// tratamento central de erros. Separado de server.js para facilitar testes
// futuros (permite importar o app sem subir a porta).
const express = require('express');
const cors = require('cors');
const path = require('path');

const watchRoutes = require('./routes/watchRoutes');
const leadRoutes = require('./routes/leadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
  })
);
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', watchRoutes);
app.use('/api', leadRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

app.use(errorHandler);

module.exports = app;
