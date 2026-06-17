const Resume = require('../models/Resume');

// @desc    Get all resumes list (Excludes heavy Base64 string for performance)
// @route   GET /api/resumes
const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({}).sort({ createdAt: -1 });
    if(!resumes.length) {
      return res.status(200).json({ success: false, message: 'No resumes found' });
    }
    res.status(200).json({ success: true, resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Upload a new resume
// @route   POST /api/resumes
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
        }

        // Convert file buffer to Base64 string
        const base64Str = req.file.buffer.toString('base64');

        const newResume = new Resume({
            title: req.body.title || 'Untitled Resume',
            fileName: req.file.originalname,
            contentType: req.file.mimetype,
            pdfData: base64Str,
        });

        await newResume.save();
        res.status(201).json({ success: true, message: 'Resume uploaded successfully', resumeId: newResume._id });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Update/Edit an existing resume (Metadata or File)
// @route   PUT /api/resumes/:id
const updateResume = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = { title: req.body.title };

        // If a new file is uploaded, convert it to Base64 and update fields
        if (req.file) {
            updateData.pdfData = req.file.buffer.toString('base64');
            updateData.fileName = req.file.originalname;
            updateData.contentType = req.file.mimetype;
        }

        const updatedResume = await Resume.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedResume) {
            return res.status(404).json({ success: false, message: 'Resume not found' });
        }

        res.status(200).json({ success: true, message: 'Resume updated successfully', resumeId: updatedResume._id });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
const deleteResume = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedResume = await Resume.findByIdAndDelete(id);

        if (!deletedResume) {
            return res.status(404).json({ success: false, message: 'Resume not found' });
        }

        res.status(200).json({ success: true, message: 'Resume deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get a resume by ID (Optional: Useful for viewing/downloading)
// @route   GET /api/resumes/:id
const getResume = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

        res.status(200).json({ success: true, resume });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports = {
    uploadResume,
    updateResume,
    deleteResume,
    getResume,
    getAllResumes
};