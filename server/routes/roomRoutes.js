const express = require('express');
const router = express.Router();
const { getRooms, bookRoom } = require('../controllers/roomController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Secure all conference room endpoints with JWT token verification
router.use(authenticateToken);

router.get('/', getRooms);
router.post('/:id/book', bookRoom);

module.exports = router;
