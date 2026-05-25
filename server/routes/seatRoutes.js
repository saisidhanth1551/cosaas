const express = require('express');
const router = express.Router();
const { getSeats, updateSeat } = require('../controllers/seatController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Secure all endpoints under JWT verification middleware
router.use(authenticateToken);

// Routes definition
router.get('/', getSeats);
router.put('/:id', updateSeat);

module.exports = router;
