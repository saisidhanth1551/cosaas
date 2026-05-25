const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: Missing user authentication context' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access Forbidden: Role '${req.user.role}' is not authorized to access this module`
      });
    }

    next();
  };
};

module.exports = { authorizeRoles };
