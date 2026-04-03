const ProjectCategory = require('../models/ProjectCategory');
const cache = require('../utils/cache');

// @desc    Get all categories (with and without pagination)
// @route   GET /api/project-categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const cacheKey = `projectCategories:${req.originalUrl}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (!page || !limit) {
      const categories = await ProjectCategory.find();
      const resp = { success: true, count: categories.length, categories };
      cache.set(cacheKey, resp, 30);
      return res.status(200).json(resp);
    }

    const skip = (page - 1) * limit;
    const total = await ProjectCategory.countDocuments();
    const categories = await ProjectCategory.find().skip(skip).limit(limit);

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

// @desc    Get single category
// @route   GET /api/project-categories/:id
// @access  Public
const getCategory = async (req, res) => {
  try {
    const cacheKey = `projectCategory:${req.params.id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const category = await ProjectCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    const resp = { success: true, category };
    cache.set(cacheKey, resp, 60);
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a category
// @route   POST /api/project-categories
// @access  Private
const createCategory = async (req, res) => {
  try {
    const category = await ProjectCategory.create(req.body);
    cache.flush();
    res.status(201).json({ success: true, message: 'Category created successfully', category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/project-categories/:id
// @access  Private
const updateCategory = async (req, res) => {
  try {
    const category = await ProjectCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    await ProjectCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    cache.flush();
    res.status(200).json({ success: true, message: 'Category updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/project-categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  try {
    const category = await ProjectCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    await category.deleteOne();
    cache.flush();
    res.status(200).json({ success: true, message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
