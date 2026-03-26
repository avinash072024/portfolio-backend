const express = require('express');
const router = express.Router();
const { getContact, updateContact } = require('../controllers/contactController');

router.get('/', getContact);
router.post('/', updateContact);

module.exports = router;
