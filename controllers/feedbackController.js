const Feedback = require('../models/Feedback');
const cache = require('../utils/cache');

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Public
const getFeedbacks = async (req, res) => {
  try {
    const cacheKey = `feedback:${req.originalUrl}`;
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
      const feedback = await Feedback.find(query).sort({ createdAt: -1 });
      const resp = {
        success: true,
        count: feedback.length,
        feedback,
      };
      cache.set(cacheKey, resp, 30);
      return res.status(200).json(resp);
    }

    // With pagination
    const skip = (page - 1) * limit;

    const total = await Feedback.countDocuments(query);
    const feedback = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const resp = {
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: feedback.length,
      feedback,
    };
    cache.set(cacheKey, resp, 30);
    res.status(200).json(resp);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single feedback
// @route   GET /api/feedback/:id
// @access  Public
const getFeedback = async (req, res) => {
  try {
    const cacheKey = `feedback:${req.params.id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    const resp = { success: true, feedback };
    cache.set(cacheKey, resp, 60);
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a feedback
// @route   POST /api/feedback
// @access  Private
const createFeedback = async (req, res) => {
  try {
    const { verified, ...feedbackData } = req.body;
    const feedback = await Feedback.create({
      ...feedbackData,
      verified: false,
    });
    cache.flush();
    res.status(201).json({ success: true, message: 'Feedback created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a feedback
// @route   PUT /api/feedback/:id
// @access  Private
const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    const { verified, ...updateData } = req.body;

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    cache.flush();
    res.status(200).json({ success: true, message: 'Feedback updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update feedback verified flag
// @route   PATCH /api/feedback/:id/verified
// @access  Private
const updateFeedbackVerified = async (req, res) => {
  try {
    const { verified } = req.body;

    if (typeof verified !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'verified must be a boolean value',
      });
    }

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    feedback.verified = verified;
    await feedback.save();

    cache.flush();
    res.status(200).json({
      success: true,
      message: 'Feedback verification status updated successfully',
      feedback,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a feedback
// @route   DELETE /api/feedback/:id
// @access  Private
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    await feedback.deleteOne();
    cache.flush();
    res.status(200).json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete multiple feedbacks
// @route   DELETE /api/feedback/bulk
// @access  Private
const deleteMultipleFeedbacks = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of feedback IDs to delete' });
    }

    const result = await Feedback.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'No feedbacks found for the provided IDs' });
    }

    const deleteCount = `${result.deletedCount}` === '1' ? 'feedback' : 'feedbacks';

    cache.flush();
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} ${deleteCount} deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update multiple feedback verified flags
// @route   PATCH /api/feedback/bulk/verified
// @access  Private
const updateMultipleFeedbackVerified = async (req, res) => {
  try {
    const { ids, verified } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of feedback IDs to update' });
    }

    if (typeof verified !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'verified must be a boolean value',
      });
    }

    const result = await Feedback.updateMany(
      { _id: { $in: ids } },
      { $set: { verified: verified } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: 'No feedbacks found for the provided IDs' });
    }

    cache.flush();
    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} feedback verification status updated successfully`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFeedbacks,
  getFeedback,
  createFeedback,
  updateFeedback,
  updateFeedbackVerified,
  deleteFeedback,
  deleteMultipleFeedbacks,
  updateMultipleFeedbackVerified,
};
