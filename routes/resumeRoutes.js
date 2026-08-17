const express = require('express');
const router = express.Router();
const { generateATSResume } = require('../controllers/resumeController');

// GET: Generate ATS-Friendly PDF Resume
// URL: http://localhost:5000/api/resumes/generate-ats
router.get('/generate-ats', generateATSResume);

module.exports = router;
