const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// @route   POST /api/chat
// @desc    Get AI response for chatbot
// @access  Public
router.post('/', chatbotController.getChatResponse);

module.exports = router;
