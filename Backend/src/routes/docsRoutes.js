// src/routes/docsRoutes.js
// Defines routes for uploading and retrieving YAML docs.

const express = require('express');
const router = express.Router();
const upload  = require('../config/multer');
const docsController = require('../controllers/docsController');
const { ensureAuthenticated } =  require('../controllers/authController');


router.use(ensureAuthenticated);

// POST /api/docs/upload - Upload a YAML file
router.post('/upload', upload.single('file'), docsController.uploadDoc);

// GET /api/docs - Get all documents for the current user
router.get('/', docsController.getAllDocs);

// GET /api/docs/:id - Get document by ID (owner only)
router.get('/:id', docsController.getDocById);

// PUT /api/docs/:id - Update document by ID (owner only)
router.put('/:id', upload.single('file'), docsController.updateDoc);

// DELETE /api/docs/:id - Delete document by ID (owner only)
router.delete('/:id', docsController.deleteDoc);

module.exports = router;
