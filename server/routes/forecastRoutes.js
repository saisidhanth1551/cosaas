const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getOccupancyForecast } = require('../controllers/forecastController');

// @route   GET /api/forecast
// @desc    Retrieve dynamic AI occupancy forecast analytics
// @access  Private (Requires authenticated user JWT session context)
router.get('/', authenticateToken, getOccupancyForecast);

module.exports = router;
