const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  deleteMultipleServices,
} = require('../controllers/serviceController');

router.route('/').get(getServices).post(createService);
router.route('/bulk').delete(deleteMultipleServices);
router.route('/:id').get(getServiceById).put(updateService).delete(deleteService);

module.exports = router;
