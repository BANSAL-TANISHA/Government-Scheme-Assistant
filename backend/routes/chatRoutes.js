const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, clearHistory } = require('../controllers/chatController');
const { protect, optionalAuth } = require('../middleware/auth');

router.post('/message', optionalAuth, sendMessage);
router.get('/history/:sessionId', protect, getChatHistory);
router.delete('/history/:sessionId', protect, clearHistory);

module.exports = router;
