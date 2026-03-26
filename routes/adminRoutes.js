const express = require('express');
const router = express.Router();
const {
  authAdmin,
  addAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin
} = require('../controllers/adminController');

router.route('/').post(addAdmin).get(getAdmins);
router.post('/login', authAdmin);
router.route('/:id').put(updateAdmin).delete(deleteAdmin);

module.exports = router;
