// This file handles the Multer configuration for file uploads, storing in memory.

const multer = require('multer');
const path = require('path');

// Use memoryStorage so files are not written to disk
const storage = multer.memoryStorage();

// Optional file filter to allow only YAML, YML, and JSON files
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.yaml' || ext === '.yml' || ext === '.json') {
    cb(null, true);
  } else {
    cb(new Error('Only YAML or JSON files are allowed!'));
  }
};

// Create the Multer upload instance with memoryStorage
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
