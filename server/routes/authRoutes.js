const express = require('express');
const router = express.Router();
const { login, getMe, register } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.get('/me', authenticateToken, getMe);

// Protected Sample Route: Only Admins can access
router.get('/admin-only', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.status(200).json({
    message: '✨ Security Clearance Approved! Welcome to the Admin Inner-Circle Command Center.',
    activeAdmin: {
      name: req.user.name,
      email: req.user.email,
      branch: req.user.branch
    }
  });
});

module.exports = router;
