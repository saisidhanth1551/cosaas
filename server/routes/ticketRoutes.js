const express = require('express');
const router = express.Router();
const { getTickets, createTicket, updateTicket } = require('../controllers/ticketController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Secure all support ticket operations with JWT token verification
router.use(authenticateToken);

router.get('/', getTickets);
router.post('/', createTicket);
router.put('/:id', updateTicket);

module.exports = router;
