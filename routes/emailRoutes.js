const express = require('express');
const router = express.Router();
const {
  getEmails,
  getEmail,
  createMails,
  deleteEmail,
  deleteMultipleEmails,
} = require('../controllers/emailController');

router.route('/').get(getEmails).post(createMails);
router.route('/bulk').delete(deleteMultipleEmails);
router.route('/:id').get(getEmail).delete(deleteEmail);

module.exports = router;
