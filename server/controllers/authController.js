const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Log in seeded corporate user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both corporate email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid corporate email or password' });
    }

    // Verify Password match using our User Schema method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid corporate email or password' });
    }

    // Sign JWT
    const JWT_SECRET = process.env.JWT_SECRET || 'cosaas_jwt_super_security_secret_key_987654321';
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });

    console.log(`🔑 User ${user.email} successfully logged in. Token issued.`);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch
      }
    });
  } catch (error) {
    console.error(`❌ Authentication controller login error: ${error.message}`);
    res.status(500).json({ error: 'Internal server authentication pipeline failure' });
  }
};

// @desc    Retrieve currently active user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user has already been set by authenticateToken middleware (with password omitted)
    res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        branch: req.user.branch
      }
    });
  } catch (error) {
    console.error(`❌ Fetch active profile controller error: ${error.message}`);
    res.status(500).json({ error: 'Internal server profile query failure' });
  }
};

// @desc    Register a new corporate user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, branch } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Please enter name, email, password, and role' });
    }

    // Verify email uniqueness
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'A corporate account with this email address already exists' });
    }

    // Create user document (pre-save hook will handle bcrypt hashing)
    const user = new User({
      name,
      email,
      password,
      role: role.toLowerCase(),
      branch: branch ? branch.toLowerCase() : 'indiranagar'
    });

    await user.save();

    // Sign JWT
    const JWT_SECRET = process.env.JWT_SECRET || 'cosaas_jwt_super_security_secret_key_987654321';
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });

    console.log(`🔑 New corporate user registered: ${user.email} (${user.role})`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch
      }
    });
  } catch (error) {
    console.error(`❌ Registration controller error: ${error.message}`);
    res.status(500).json({ error: 'Internal server registration pipeline failure' });
  }
};

module.exports = {
  login,
  getMe,
  register
};
