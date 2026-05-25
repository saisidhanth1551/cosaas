const express = require('express');
const router = express.Router();
const { getActivityFeed } = require('../controllers/activityController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Protected operational timeline feed
router.get('/', authenticateToken, getActivityFeed);

module.exports = router;
