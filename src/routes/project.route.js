const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');

// Create
router.post('/', projectController.createProject);

// Read all
router.get('/', projectController.getProjects);

// Read by ID
router.get('/:id', projectController.getProjectById);

// Update
router.put('/:id', projectController.updateProject);

// Delete
router.delete('/:id', projectController.deleteProject);

module.exports = router;
