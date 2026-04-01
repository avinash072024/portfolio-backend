const Resume = require('../models/Resume');
const cache = require('../utils/cache');
const fs = require('fs');
const path = require('path');

// GET /api/resumes
exports.getResumes = async (req, res) => {
  try {
    const cacheKey = `resumes:${req.originalUrl}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const resumes = await Resume.find().sort({ createdAt: -1 });
    cache.set(cacheKey, resumes, 30);
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/resumes/:id
exports.getResume = async (req, res) => {
  try {
    const cacheKey = `resume:${req.params.id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    cache.set(cacheKey, resume, 60);
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/resumes
exports.addResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const file = req.file;
    const resume = await Resume.create({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: `/uploads/resumes/${file.filename}`,
    });

    cache.flush();
    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/resumes/:id
exports.updateResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    // If a new file is uploaded, remove old file and update fields
    if (req.file) {
        // remove old file
        if (resume.filename) {
          const oldPath = path.join(__dirname, '..', 'uploads', 'resumes', resume.filename);
          try {
            if (fs.existsSync(oldPath)) await fs.promises.unlink(oldPath);
          } catch (err) {
            console.error('Failed to remove old resume file:', err.message);
          }
        }

      resume.filename = req.file.filename;
      resume.originalName = req.file.originalname;
      resume.mimeType = req.file.mimetype;
      resume.size = req.file.size;
      resume.path = `/uploads/resumes/${req.file.filename}`;
    }

    await resume.save();
    cache.flush();
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/resumes/:id
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    // remove file from disk
      if (resume.filename) {
        const filePath = path.join(__dirname, '..', 'uploads', 'resumes', resume.filename);
        try {
          if (fs.existsSync(filePath)) await fs.promises.unlink(filePath);
        } catch (err) {
          console.error('Failed to remove resume file during delete:', err.message);
        }
      }

    await resume.deleteOne();
    cache.flush();
    res.json({ success: true, message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
