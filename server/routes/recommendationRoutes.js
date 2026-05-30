const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendationController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getRecommendations);

module.exports = router;
