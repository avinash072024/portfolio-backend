const Education = require('../models/Education');
const cache = require('../utils/cache');

// @desc    Get all education records
// @route   GET /api/education
// @access  Public
const getEducations = async (req, res) => {
  try {
    const cacheKey = `educations:${req.originalUrl}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const educations = await Education.find();
    const resp = {
      success: true,
      count: educations.length,
      educations,
    };
    cache.set(cacheKey, resp, 30);
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single education record
// @route   GET /api/education/:id
// @access  Public
const getEducationById = async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);
    if (!education) {
      return res.status(404).json({ success: false, message: 'Education not found' });
    }
    res.status(200).json({ success: true, education });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create an education record
// @route   POST /api/education
// @access  Private
const createEducation = async (req, res) => {
  try {
    const { title, institution, duration, description } = req.body;

    if (!title || !institution || !duration) {
      return res.status(400).json({ success: false, message: 'Please add all required fields' });
    }

    const education = await Education.create({
      title,
      institution,
      duration,
      description,
    });

    cache.flush();
    res.status(201).json({ success: true, message: 'Education created successfully', data: education });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an education record
// @route   PUT /api/education/:id
// @access  Private
const updateEducation = async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);

    if (!education) {
      return res.status(404).json({ success: false, message: 'Education not found' });
    }

    const updatedEducation = await Education.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    cache.flush();
    res.status(200).json({ success: true, message: 'Education updated successfully', data: updatedEducation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an education record
// @route   DELETE /api/education/:id
// @access  Private
const deleteEducation = async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);

    if (!education) {
      return res.status(404).json({ success: false, message: 'Education not found' });
    }

    await education.deleteOne();

    cache.flush();
    res.status(200).json({ success: true, message: 'Education deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEducations,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
};
