const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getRenewalPredictions } = require('../controllers/renewalController');

// @route   GET /api/renewal-predictions
// @desc    Retrieve enterprise dynamic client churn risk predictions
// @access  Private (Requires authenticated user JWT session context)
router.get('/', authenticateToken, getRenewalPredictions);

module.exports = router;
