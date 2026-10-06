const express = require('express');
const Project = require('../models/Project');
const requireAdmin = require('../middleware/auth');

const router = express.Router();

// Public: list all projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, year: -1 }).lean();
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// Public: one project by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug }).lean();
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    res.json(project);
  } catch (err) {
    next(err);
  }
});

// Admin: create
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    if (err.name === 'ValidationError' || err.code === 11000) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// Admin: update
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    res.json(project);
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
});

// Admin: delete
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found.' });
    res.json({ deleted: true });
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid project id.' });
    next(err);
  }
});

module.exports = router;
