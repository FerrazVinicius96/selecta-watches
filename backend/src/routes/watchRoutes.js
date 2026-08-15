// Rota pública do catálogo, consumida pela landing page.
const express = require('express');
const watchController = require('../controllers/watchController');

const router = express.Router();

router.get('/watches', watchController.listPublic);

module.exports = router;
