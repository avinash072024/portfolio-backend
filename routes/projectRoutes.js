const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  deleteMultipleProjects,
} = require('../controllers/projectController');

router.route('/').get(getProjects).post(createProject);
router.route('/bulk').delete(deleteMultipleProjects);
router.route('/:id').get(getProject).put(updateProject).delete(deleteProject);

module.exports = router;
