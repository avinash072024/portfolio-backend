const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadResume, updateResume, deleteResume, getResume, getAllResumes } = require('../controllers/resumeController');

// Multer memory storage configuration (keeps file in memory buffer)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Restrict uploads strictly to PDFs
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

// POST: Upload Resume
// URL: http://localhost:5000/api/resumes/
router.post('/', upload.single('resume'), uploadResume);

// PUT: Edit/Update Resume (Can update text title, replace file, or both)
// URL: http://localhost:5000/api/resumes/:id
router.put('/:id', upload.single('resume'), updateResume);

// DELETE: Remove Resume
// URL: http://localhost:5000/api/resumes/:id
router.delete('/:id', deleteResume);

// GET: Fetch Single Resume Details
// URL: http://localhost:5000/api/resumes/:id
router.get('/:id', getResume);

// GET: Fetch All Resumes (Metadata only)
// URL: http://localhost:5000/api/resumes
router.get('/', getAllResumes);

module.exports = router;