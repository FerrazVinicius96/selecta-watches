// Rotas do painel admin: login é público, as demais exigem JWT válido
// (middleware requireAuth aplicado a partir daqui).
const express = require('express');
const authController = require('../controllers/authController');
const watchController = require('../controllers/watchController');
const leadController = require('../controllers/leadController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/login', authController.login);

router.use(requireAuth);

router.get('/watches', watchController.listAll);
router.post('/watches', watchController.create);
router.put('/watches/:id', watchController.update);
router.delete('/watches/:id', watchController.remove);

router.get('/leads', leadController.list);

module.exports = router;
