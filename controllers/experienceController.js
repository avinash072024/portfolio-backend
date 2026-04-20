const Experience = require('../models/Experience');
const cache = require('../utils/cache');

// @desc    Get all experiences
// @route   GET /api/experience
// @access  Public
// const getExperiences = async (req, res) => {
//   try {
//     const cacheKey = `experiences:${req.originalUrl}`;
//     const cached = cache.get(cacheKey);
//     if (cached) return res.status(200).json(cached);

//     const experiences = await Experience.find();
//     const resp = {
//       success: true,
//       count: experiences.length,
//       experiences
//     };
//     cache.set(cacheKey, resp, 30);
//     res.status(200).json(resp);
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
const getExperiences = async (req, res) => {
  try {
    const cacheKey = `experiences:${req.originalUrl}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const experiences = await Experience.find();

    // 🔥 Calculate total experience
    let totalMonths = 0;

    experiences.forEach(exp => {
      if (exp.duration) {
        const parts = exp.duration.split('-').map(p => p.trim());

        let startYear = parseInt(parts[0]);
        let endYear;

        if (parts[1].toLowerCase() === 'present') {
          endYear = new Date().getFullYear();
        } else {
          endYear = parseInt(parts[1]);
        }

        if (!isNaN(startYear) && !isNaN(endYear)) {
          totalMonths += (endYear - startYear) * 12;
        }
      }
    });

    const totalYears = Math.round(totalMonths / 12);

    const resp = {
      success: true,
      count: experiences.length,
      totalExperience: totalYears, // 👈 added
      experiences
    };

    cache.set(cacheKey, resp, 30);
    res.status(200).json(resp);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single experience
// @route   GET /api/experience/:id
// @access  Public
const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }
    res.status(200).json({ success: true, experience });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create an experience
// @route   POST /api/experience
// @access  Private
const createExperience = async (req, res) => {
  try {
    const { title, company, duration, description } = req.body;

    if (!title || !company || !duration) {
      return res.status(400).json({ success: false, message: 'Please add all required fields' });
    }

    const experience = await Experience.create({
      title,
      company,
      duration,
      description,
    });

    cache.flush();
    res.status(201).json({ success: true, message: 'Experience created successfully', data: experience });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an experience
// @route   PUT /api/experience/:id
// @access  Private
const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }

    const updatedExperience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    cache.flush();
    res.status(200).json({ success: true, message: 'Experience updated successfully', data: updatedExperience });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an experience
// @route   DELETE /api/experience/:id
// @access  Private
const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }

    await experience.deleteOne();

    cache.flush();
    res.status(200).json({ success: true, message: 'Experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
};
