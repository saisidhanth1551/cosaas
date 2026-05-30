const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getBranchLoadScore } = require('../controllers/loadController');

// @route   GET /api/load-score
// @desc    Retrieve dynamic branch operational load scores
// @access  Private (Requires authenticated user JWT session)
router.get('/', authenticateToken, getBranchLoadScore);

module.exports = router;
