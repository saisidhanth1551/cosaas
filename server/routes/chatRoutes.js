const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { handleChat } = require('../controllers/chatController');

// @desc    Conversational portal with COSMO AI Business Assistant
// @route   POST /api/chat
// @access  Private (JWT protected)
router.post('/', authenticateToken, handleChat);

module.exports = router;
