// src/controllers/incidents.controller.js
const IncidentService = require('../services/incident.service');

exports.getAll = async (req, res) => {
  const { bbox } = req.query;
  const incidents = await IncidentService.list(bbox);
  res.json(incidents);
};

exports.getOne = async (req, res) => {
  const incident = await IncidentService.getById(req.params.id);
  if (!incident) return res.status(404).json({ message: 'Not found' });
  res.json(incident);
};

exports.create = async (req, res) => {
  const {
    title,
    description = '',
    severity,
    category,
    lat,
    lng,
  } = req.body;

  const reporterId = req.user.sub; // JWT auth middleware ensured this exists

  const incident = await IncidentService.create({
    title,
    description,
    severity,
    category,
    lat,
    lng,
    reportedBy: reporterId,
  });

  // If the AI flagged the report as REJECTED, we still return it but with a 202 status
  if (incident.status === 'REJECTED') {
    return res.status(202).json({
      message: 'Report received but flagged as spam – it will not be displayed publicly.',
      incident,
    });
  }

  // Normal case
  res.status(201).json(incident);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const updated = await IncidentService.updateStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
};
