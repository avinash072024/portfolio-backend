const Service = require('../models/Service');
const cache = require('../utils/cache');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const cacheKey = `services:${req.originalUrl}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    // If no pagination params → return all
    if (!page || !limit) {
      const services = await Service.find();
      const resp = {
        success: true,
        count: services.length,
        services
      };
      cache.set(cacheKey, resp, 30);
      return res.status(200).json(resp);
    }

    // With pagination  
    const skip = (page - 1) * limit;

    const total = await Service.countDocuments();
    const services = await Service.find().skip(skip).limit(limit);

    const resp = {
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: services.length,
      services,
    };
    cache.set(cacheKey, resp, 30);
    res.status(200).json(resp);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const cacheKey = `service:${req.params.id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    const resp = { success: true, service };
    cache.set(cacheKey, resp, 60);
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private
const createService = async (req, res) => {
  try {
    const { title, icon, description, features } = req.body;

    if (!title || !icon || !description || !features || !Array.isArray(features)) {
      return res.status(400).json({ success: false, message: 'Please add all required fields' });
    }

    const service = await Service.create({
      title,
      icon,
      description,
      features,
    });

    cache.flush();
    res.status(201).json({ success: true, message: 'Service created successfully', service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    cache.flush();
    res.status(200).json({ success: true, message: 'Service updated successfully', service: updatedService });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    await service.deleteOne();

    cache.flush();
    res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
