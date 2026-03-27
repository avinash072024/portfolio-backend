const express = require('express');
const router = express.Router();
const { saveVisitorData, getVisitors } = require('../controllers/visitorController');

router.post('/log', saveVisitorData);
router.get('/all', getVisitors);

module.exports = router;
