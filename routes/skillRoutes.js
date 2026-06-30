const express = require('express');
const router = express.Router();
const {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  deleteMultipleSkills,
} = require('../controllers/skillController');

router.route('/').get(getSkills).post(createSkill);
router.route('/bulk').delete(deleteMultipleSkills);
router.route('/:id').get(getSkill).put(updateSkill).delete(deleteSkill);

module.exports = router;
