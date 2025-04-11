// src/routes/docsRoutes.js
// Defines routes for uploading and retrieving YAML docs.

const express = require('express');
const router = express.Router();
const upload  = require('../config/multer');
const docsController = require('../controllers/docsController');



// POST /api/docs/upload - Upload a YAML file
router.post('/upload', upload.single('file'), docsController.uploadDoc);

// GET /api/docs - Get all docs
router.get('/', docsController.getAllDocs);

// GET /api/docs/:id - Get a doc by ID
router.get('/:id', docsController.getDocById);

// PUT /api/docs/:id - Update a doc by ID
router.put('/:id', docsController.updateDoc);

// DELETE /api/docs/:id - Delete a doc by ID
router.delete('/:id', docsController.deleteDoc);

module.exports = router;
