const watchService = require('../services/watchService');

async function listPublic(req, res, next) {
  try {
    const watches = await watchService.getPublicCatalog({ featured: req.query.featured });
    res.json(watches);
  } catch (err) {
    next(err);
  }
}

async function listAll(req, res, next) {
  try {
    const watches = await watchService.getAllForAdmin();
    res.json(watches);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const watch = await watchService.createWatch(req.body);
    res.status(201).json(watch);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const watch = await watchService.updateWatch(req.params.id, req.body);
    res.json(watch);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await watchService.deleteWatch(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listPublic, listAll, create, update, remove };
