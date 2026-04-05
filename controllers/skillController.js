const Skill = require('../models/Skill');
const cache = require('../utils/cache');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res) => {
  try {
    const cacheKey = `skills:${req.originalUrl}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const { search, page: pageQuery, limit: limitQuery } = req.query;
    const page = parseInt(pageQuery);
    const limit = parseInt(limitQuery);

    let query = {};
    if (search) {
      query = { name: { $regex: search, $options: 'i' } };
    }

    // If no pagination params → return all filtered
    if (!page || !limit) {
      const skills = await Skill.find(query);
      const resp = {
        success: true,
        count: skills.length,
        skills,
      };
      cache.set(cacheKey, resp, 30);
      return res.status(200).json(resp);
    }

    // With pagination
    const skip = (page - 1) * limit;

    const total = await Skill.countDocuments(query);
    const skills = await Skill.find(query)
      .skip(skip)
      .limit(limit);

    const resp = {
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: skills.length,
      skills,
    };
    cache.set(cacheKey, resp, 30);
    res.status(200).json(resp);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
const getSkill = async (req, res) => {
  try {
    const cacheKey = `skill:${req.params.id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    const resp = { success: true, skill };
    cache.set(cacheKey, resp, 60);
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private
const createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    cache.flush();
    res.status(201).json({ success: true, message: 'Skill created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    cache.flush();
    res.status(200).json({ success: true, message: 'Skill updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    await skill.deleteOne();
    cache.flush();
    res.status(200).json({ success: true, message: 'Skill removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
};
