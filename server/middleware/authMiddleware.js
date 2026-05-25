const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'cosaas_jwt_super_security_secret_key_987654321';
    
    // Verify Token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch user and attach to request context (excluding password hash)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Session user account not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(`🛡️ Auth Middleware verification error: ${error.message}`);
    return res.status(403).json({ error: 'Invalid or expired session token' });
  }
};

module.exports = { authenticateToken };
