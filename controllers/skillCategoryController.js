const SkillCategory = require('../models/SkillCategory');
const cache = require('../utils/cache');

// @desc    Get all skill categories (with and without pagination)
// @route   GET /api/skill-categories
// @access  Public
const getSkillCategories = async (req, res) => {
  try {
    const cacheKey = `skillCategories:${req.originalUrl}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (!page || !limit) {
      const categories = await SkillCategory.find();
      const resp = { success: true, count: categories.length, categories };
      cache.set(cacheKey, resp, 30);
      return res.status(200).json(resp);
    }

    const skip = (page - 1) * limit;
    const total = await SkillCategory.countDocuments();
    const categories = await SkillCategory.find().skip(skip).limit(limit);

    const resp = {
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      count: categories.length,
      categories,
    };
    cache.set(cacheKey, resp, 30);
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single skill category
// @route   GET /api/skill-categories/:id
// @access  Public
const getSkillCategory = async (req, res) => {
  try {
    const cacheKey = `skillCategory:${req.params.id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const category = await SkillCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    const resp = { success: true, category };
    cache.set(cacheKey, resp, 60);
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a skill category
// @route   POST /api/skill-categories
// @access  Private
const createSkillCategory = async (req, res) => {
  try {
    const category = await SkillCategory.create(req.body);
    cache.flush();
    res.status(201).json({ success: true, message: 'Category created successfully', category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a skill category
// @route   PUT /api/skill-categories/:id
// @access  Private
const updateSkillCategory = async (req, res) => {
  try {
    const category = await SkillCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    await SkillCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    cache.flush();
    res.status(200).json({ success: true, message: 'Category updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a skill category
// @route   DELETE /api/skill-categories/:id
// @access  Private
const deleteSkillCategory = async (req, res) => {
  try {
    const category = await SkillCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    await category.deleteOne();
    cache.flush();
    res.status(200).json({ success: true, message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSkillCategories,
  getSkillCategory,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
};
