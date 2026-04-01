const Project = require('../models/Project');
const cache = require('../utils/cache');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
// const getProjects = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page, 10) || 1;
//     const limit = parseInt(req.query.limit, 10) || 5;
//     const skip = (page - 1) * limit;

//     const total = await Project.countDocuments();
//     const projects = await Project.find().skip(skip).limit(limit);
//     const totalPages = Math.ceil(total / limit) || 1;

//     res.status(200).json({
//       success: true,
//       page,
//       limit,
//       total,
//       totalPages,
//       count: projects.length,
//       projects,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const getProjects = async (req, res) => {
  try {
    const cacheKey = `projects:${req.originalUrl}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    // If no pagination params → return all
    if (!page || !limit) {
      const projects = await Project.find();
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

    const total = await Project.countDocuments();
    const projects = await Project.find().skip(skip).limit(limit);

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
    const project = await Project.create(req.body);
    // clear caches so list endpoints show newest data
    cache.flush();
    res.status(201).json({ success: true, message: "Project created successfully" });
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

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    cache.flush();
    res.status(200).json({ success: true, message: "Project updated successfully" });
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
    res.status(200).json({ success: true, message: 'Project removed' });
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
};
