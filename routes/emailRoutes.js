const express = require('express');
const router = express.Router();
const {
  getEmails,
  getEmail,
  createMails,
  deleteEmail,
} = require('../controllers/emailController');

router.route('/').get(getEmails).post(createMails);
router.route('/:id').get(getEmail).delete(deleteEmail);

module.exports = router;
