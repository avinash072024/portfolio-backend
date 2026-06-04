const express = require('express');
const router = express.Router();
const { saveVisitorData, getVisitors, deleteDuplicateVisitors } = require('../controllers/visitorController');

router.post('/log', saveVisitorData);
router.get('/all', getVisitors);
router.delete('/duplicates', deleteDuplicateVisitors);

module.exports = router;
