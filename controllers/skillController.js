const Skill = require('../models/Skill');
const cache = require('../utils/cache');

// // @desc    Get all skills
// // @route   GET /api/skills
// // @access  Public
// const getSkills = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page, 10) || 1;
//     const limit = parseInt(req.query.limit, 10) || 5;
//     const safePage = page > 0 ? page : 1;
//     const safeLimit = limit > 0 ? limit : 5;

//     const total = await Skill.countDocuments();
//     const totalPages = Math.ceil(total / safeLimit) || 1;
//     const skip = (safePage - 1) * safeLimit;

//     const skills = await Skill.find().skip(skip).limit(safeLimit);

//     res.status(200).json({
//       success: true,
//       page: safePage,
//       limit: safeLimit,
//       total,
//       totalPages,
//       count: skills.length,
//       skills,
//     });
//   } catch (error) {
//     res.status(500).json({success: false, message: error.message });
//   }
// };


// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res) => {
  try {
    const cacheKey = `skills:${req.originalUrl}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    // If no pagination params → return all
    if (!page || !limit) {
      const skills = await Skill.find();
      const resp = {
        success: true,
        count: skills.length,
        skills
      };
      cache.set(cacheKey, resp, 30);
      return res.status(200).json(resp);
    }

    // With pagination  
    const skip = (page - 1) * limit;

    const total = await Skill.countDocuments();
    const skills = await Skill.find().skip(skip).limit(limit);

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
const getSkillById = async (req, res) => {
  try {
    const cacheKey = `skill:${req.params.id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    const resp = {success: true, skill};
    cache.set(cacheKey, resp, 60);
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({success: false, message: error.message });
  }
};

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private
const createSkill = async (req, res) => {
  try {
    const { name, icon, level, color, category } = req.body;

    if (!name || !icon || !level || !color || !category) {
      return res.status(400).json({ success: false, message: 'Please add all required fields' });
    }

    const skill = await Skill.create({
      name,
      icon,
      level,
      color,
      category,
    });

    cache.flush();
    res.status(201).json( {success: true, message: 'Skill created successfully'});
  } catch (error) {
    res.status(500).json({success: false, message: error.message });
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
    res.status(200).json({success: true, message: 'Skill updated successfully'});
  } catch (error) {
    res.status(500).json({success: false, message: error.message });
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
    res.status(200).json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
};
