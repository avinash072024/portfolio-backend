const Project = require('../models/Project');
const cache = require('../utils/cache');
const { emit } = require('../utils/socket');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const cacheKey = `projects:${req.originalUrl}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const { search, showOnResume, page: pageQuery, limit: limitQuery } = req.query;
    const page = parseInt(pageQuery);
    const limit = parseInt(limitQuery);

    let query = {};
    
    // Search filter by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Filter by showOnResume if explicitly provided in query params (e.g., ?showOnResume=true)
    if (showOnResume !== undefined) {
      query.showOnResume = showOnResume === 'true';
    }

    // If no pagination params → return all filtered
    if (!page || !limit) {
      const projects = await Project.find(query);
      const resp = {
        success: true,
        count: projects.length,
        projects,
      };
      cache.set(cacheKey, resp, 30);
      return res.status(200).json(resp);
    }

    // With pagination
    const skip = (page - 1) * limit;

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .skip(skip)
      .limit(limit);

    const resp = {
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      count: projects.length,
      projects,
    };
    cache.set(cacheKey, resp, 30);
    res.status(200).json(resp);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProject = async (req, res) => {
  try {
    const cacheKey = `project:${req.params.id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    const resp = { success: true, project };
    cache.set(cacheKey, resp, 60);
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private (assume public for now)
const createProject = async (req, res) => {
  try {
    // req.body will automatically capture showOnResume if sent from client
    const project = await Project.create(req.body);
    
    cache.flush();
    emit('refresh-data', { resource: 'project', action: 'create', projectId: project._id });
    res.status(201).json({ success: true, message: "Project created successfully", project });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // findByIdAndUpdate handles updates to showOnResume if provided in req.body
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    cache.flush();
    emit('refresh-data', { resource: 'project', action: 'update', projectId: updatedProject._id });
    res.status(200).json({ success: true, message: "Project updated successfully", project: updatedProject });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await project.deleteOne();
    cache.flush();
    emit('refresh-data', { resource: 'project', action: 'delete', projectId: project._id });
    res.status(200).json({ success: true, message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete multiple projects
// @route   DELETE /api/projects/bulk
// @access  Private
const deleteMultipleProjects = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of project IDs to delete' });
    }

    const result = await Project.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'No projects found for the provided IDs' });
    }

    const deleteCount = `${result.deletedCount}` === '1' ? 'project' : 'projects';

    cache.flush();
    emit('refresh-data', { resource: 'project', action: 'deleteMany', deletedCount: result.deletedCount });
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} ${deleteCount} deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  deleteMultipleProjects,
};