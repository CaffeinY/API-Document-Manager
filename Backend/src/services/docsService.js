// src/services/docsService.js
// This module handles processing the uploaded file, saving the parsed content into the database using Prisma,
// and retrieving, updating, and deleting documents from the database. It supports YAML and JSON file formats.

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { v4: uuidv4 } = require('uuid');

// Import the PrismaClient instance from the configuration file.
const prisma = require('../config/db');

/**
 * processAndSave
 * Processes the uploaded file by reading its contents and parsing it as YAML or JSON.
 * Then, it inserts the parsed content and related file information into the api_docs table.
 *
 * @param {object} file - The file object from multer containing file details.
 * @returns {object} - The inserted document record.
 */
async function processAndSave(file, title) {
  try {
    // Parse the file content into a JavaScript object.
    const parsedContent = yaml.load(file.buffer.toString('utf8'));
    const docId = uuidv4();
    // Use the original filename as the title.
    // If title is not provided, use the original filename.
    if (!title) {
      title = file.originalname.split('.')[0]; // Remove the file extension for the title.
    }
    // Create a new record in the api_docs table using Prisma.
    const createdDoc = await prisma.apiDoc.create({
      data: {
        id: docId,
        title,
        content: parsedContent,         // The JSON field can store JavaScript objects.
        originalFilename: file.originalname, // Adjust as needed (you might use file.originalname).
        fileSize: file.size,
        mimeType: file.mimetype
      }
    });
    return createdDoc;
  } catch (err) {
    console.error('Error in processAndSave:', err);
    throw err;
  }
}

/**
 * getAllDocs
 * Retrieves all document records from the api_docs table.
 *
 * @returns {Array} - Array of document records.
 */
async function getAllDocs() {
  try {
    // Find all documents using Prisma with selected fields.
    const docs = await prisma.apiDoc.findMany({
      select: {
        id: true,
        title: true,
        originalFilename: true,
        fileSize: true,
        mimeType: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return docs;
  } catch (err) {
    console.error('Error in getAllDocs:', err);
    throw err;
  }
}

/**
 * getDocById
 * Retrieves a single document record by its id.
 *
 * @param {string} id - The unique document id.
 * @returns {object|null} - The document record if found; otherwise, null.
 */
async function getDocById(id) {
  try {
    const doc = await prisma.apiDoc.findUnique({
      where: { id }
    });
    if (doc && doc.content) {
      doc.content = jsonToYaml(doc.content);
    }
    return doc;
  } catch (err) {
    console.error('Error in getDocById:', err);
    throw err;
  }
}

/**
 * updateDoc
 * Updates an existing document record by its id.
 *
 * @param {string} id - The unique document id.
 * @param {object} updatedData - An object containing the fields to update.
 * @returns {object} - The updated document record.
 */
async function updateDoc(id, file) {
  try {
    const updatedDoc = await prisma.apiDoc.update({
      where: { id },
      data:{
        content: yaml.load(file.buffer.toString('utf8')), // Parse the file content into a JavaScript object.
        originalFilename: file.originalname, // Adjust as needed (you might use file.originalname).
        fileSize: file.size,
        mimeType: file.mimetype
      }
    });
    return updatedDoc;
  } catch (err) {
    console.error('Error in updateDoc:', err);
    throw err;
  }
}

/**
 * deleteDoc
 * Deletes a document record by its id.
 *
 * @param {string} id - The unique document id to delete.
 * @returns {object} - The deleted document record.
 */
async function deleteDoc(id) {
  try {
    const deletedDoc = await prisma.apiDoc.delete({
      where: { id }
    });
    return deletedDoc;
  } catch (err) {
    console.error('Error in deleteDoc:', err);
    throw err;
  }
}

/**
 * jsonToYaml
 * Converts JSON data (for example, the "content" field from a document record) back into YAML format.
 *
 * @param {object} jsonData - The JSON object to convert.
 * @returns {string} - The YAML string representation.
 */
function jsonToYaml(jsonData) {
  try {
    const yamlString = yaml.dump(jsonData);
    return yamlString;
  } catch (err) {
    console.error('Error converting JSON to YAML:', err);
    throw err;
  }
}

// Export the service functions.
module.exports = {
  processAndSave,
  getAllDocs,
  getDocById,
  updateDoc,
  deleteDoc,
  jsonToYaml
};
