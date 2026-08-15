const leadService = require('../services/leadService');

async function create(req, res, next) {
  try {
    const lead = await leadService.createLead(req.body);
    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const leads = await leadService.listLeads();
    res.json(leads);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list };
