// src/routes/resource.route.js

const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resource.controller');

// Create
router.post('/', resourceController.createResource);

// Read all
router.get('/', resourceController.getResources);

// Read by ID
router.get('/:id', resourceController.getResourceById);

// Update
router.put('/:id', resourceController.updateResource);

// Delete
router.delete('/:id', resourceController.deleteResource);

module.exports = router;
