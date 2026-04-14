const Email = require('../models/Email');
const cache = require('../utils/cache');

// @desc    Get all emails
// @route   GET /api/emails
// @access  Public
const getEmails = async (req, res) => {
  try {
    const cacheKey = `email:${req.originalUrl}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const { search, page: pageQuery, limit: limitQuery } = req.query;
    const page = parseInt(pageQuery);
    const limit = parseInt(limitQuery);

    let query = {};
    if (search) {
      query = { firstname: { $regex: search, $options: 'i' } };
    }

    // If no pagination params → return all filtered
    if (!page || !limit) {
      const email = await Email.find(query).sort({ createdAt: -1 });
      const resp = {
        success: true,
        count: email.length,
        email,
      };
      cache.set(cacheKey, resp, 30);
      return res.status(200).json(resp);
    }

    // With pagination
    const skip = (page - 1) * limit;

    const total = await Email.countDocuments(query);
    const email = await Email.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const resp = {
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: email.length,
      email,
    };
    cache.set(cacheKey, resp, 30);
    res.status(200).json(resp);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single email
// @route   GET /api/emails/:id
// @access  Public
const getEmail = async (req, res) => {
  try {
    const cacheKey = `email:${req.params.id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }
    const resp = { success: true, email };
    cache.set(cacheKey, resp, 60);
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a feedback
// @route   POST /api/emails
// @access  Private
const createMails = async (req, res) => {
  try {
    const { firstname, lastname, email, contact, message } = req.body;

    if (!firstname || !lastname || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please add all required fields' });
    }

    const emailData = await Email.create({
      firstname,
      lastname,
      email,
      contact,
      message
    });
    
    cache.flush();
    res.status(201).json({ success: true, message: 'Messege sent successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a email
// @route   DELETE /api/emails/:id
// @access  Private
const deleteEmail = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);

    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }

    await email.deleteOne();
    cache.flush();
    res.status(200).json({ success: true, message: 'Email deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEmails,
  getEmail,
  createMails,
  deleteEmail,
};
