const express = require('express');
const router = express.Router();
const {
  getSkillCategories,
  getSkillCategory,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
} = require('../controllers/skillCategoryController');

router.route('/').get(getSkillCategories).post(createSkillCategory);
router.route('/:id').get(getSkillCategory).put(updateSkillCategory).delete(deleteSkillCategory);

module.exports = router;
