// Rota pública de captura de leads, consumida pelo formulário da landing page.
const express = require('express');
const leadController = require('../controllers/leadController');

const router = express.Router();

router.post('/leads', leadController.create);

module.exports = router;
