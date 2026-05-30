const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getNotifications, getNotificationDetail } = require('../controllers/notificationController');

// @route   GET /api/notifications
// @access  Private
router.get('/', authenticateToken, getNotifications);

// @route   GET /api/notifications/:id
// @access  Private
router.get('/:id', authenticateToken, getNotificationDetail);

module.exports = router;
