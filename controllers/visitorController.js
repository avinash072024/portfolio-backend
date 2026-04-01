const Visitor = require('../models/Visitor');
const cache = require('../utils/cache');

// @desc    Save visitor data
// @route   POST /api/visitor/log
// @access  Public
const saveVisitorData = async (req, res) => {
  try {
    const visitorData = req.body;
    const { ip } = visitorData;

    // Check if visitor with same IP already exists
    const existingVisitor = await Visitor.findOne({ ip });


    if (existingVisitor) {
      return res.status(200).json({
        success: true,
        message: 'Visitor already exists, no need to save again',
        data: existingVisitor,
      });
    }

    const visitor = new Visitor(visitorData);
    await visitor.save();

    // clear caches so admin list reflects new visitor
    cache.flush();

    res.status(201).json({
      success: true,
      message: 'Visitor data logged successfully',
      data: visitor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging visitor data',
      error: error.message,
    });
  }
};

// @desc    Get all visitors
// @route   GET /api/visitor/all
// @access  Private (Admin only - adding simple protection later if needed)
const getVisitors = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const cacheKey = `visitors:${req.originalUrl}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    // If no pagination params → return all
    if (!page || !limit) {
      const Visitors = await Visitor.find().sort({ createdAt: -1 });
      const resp = {
        success: true,
        count: Visitors.length,
        Visitors,
      };
      cache.set(cacheKey, resp, 30);
      return res.status(200).json(resp);
    }

    // With pagination
    const skip = (page - 1) * limit;

    const total = await Visitor.countDocuments();
    const Visitors = await Visitor.find().sort({ createdAt: -1 }).skip(skip).limit(limit);

    const resp = {
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: Visitors.length,
      Visitors,
    };
    cache.set(cacheKey, resp, 30);
    res.status(200).json(resp);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  saveVisitorData,
  getVisitors,
};
