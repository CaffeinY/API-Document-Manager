// This file handles the request/response logic for docs (YAML files).

const docsService = require('../services/docsService');
const yaml = require('js-yaml');

// Handle file upload and save logic
async function uploadDoc(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file was provided' });
    }

    // Let the service layer handle the parsing and saving logic
    const docInfo = await docsService.processAndSave(req.file, req.body.title, req.user.id);
    docInfo.content = yaml.dump(docInfo.content);

    return res.json({
      message: 'File uploaded and processed successfully',
      doc: docInfo
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to upload file' });
  }
}

// Retrieve all docs
async function getAllDocs(req, res) {
  try {
    const allDocs = await docsService.getAllDocs(req.user.id);
    return res.json(allDocs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to get docs' });
  }
}

// Retrieve a doc by ID
async function getDocById(req, res) {
  try {
    const { id } = req.params;
    const doc = await docsService.getDocById(id, req.user.id);
    if (!doc) {
      return res.status(404).json({ error: 'Doc not found' });
    }
    return res.json(doc);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to get doc' });
  }
}

/**
 * updateDoc
 * Updates an existing document record.
 *
 * @param {object} req - The Express request object. Expects the document id in req.params.id and updated data in req.body.
 * @param {object} res - The Express response object.
 */
async function updateDoc(req, res){
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file was provided' });
    }
    const updatedDoc = await docsService.updateDoc(req.params.id, req.file, req.user.id);
    res.status(200).json(updatedDoc);
  } catch (error) {
    console.error('Error in updateDoc:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
};

/**
 * deleteDoc
 * Deletes a document record by its ID.
 *
 * @param {object} req - The Express request object. Expects the document id in req.params.id.
 * @param {object} res - The Express response object.
 */
async function deleteDoc(req, res){
  try {
    const deletedDoc = await docsService.deleteDoc(req.params.id, req.user.id);
    res.status(200).json(deletedDoc);
  } catch (error) {
    console.error('Error in deleteDoc:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
};

/**
 * jsonToYaml
 * Converts JSON data (passed in the request body) to YAML format.
 *
 * @param {object} req - The Express request object. Expects jsonData in req.body.
 * @param {object} res - The Express response object.
 */
async function jsonToYaml(req, res){
  try {
    const { jsonData } = req.body;
    const yamlData = docsService.jsonToYaml(jsonData);
    res.status(200).json({ yaml: yamlData });
  } catch (error) {
    console.error('Error in jsonToYaml:', error);
    res.status(500).json({ error: 'Failed to convert JSON to YAML' });
  }
};

module.exports = {
  uploadDoc,
  getAllDocs,
  getDocById,
  updateDoc,
  deleteDoc,
  jsonToYaml
};
