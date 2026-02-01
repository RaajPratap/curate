const jwt = require('jsonwebtoken');

// Verify access token
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - no token',
      });
    }

    // Verify token
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - invalid token',
      });
    }

    // Add user ID to request
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Not authorized',
    });
  }
};

// Optional auth - doesn't fail if no token, but adds userId if present
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = verifyAccessToken(token);
      if (decoded) {
        req.userId = decoded.userId;
      }
    }

    next();
  } catch (error) {
    // Continue without auth
    next();
  }
};

// Restrict to admin role (requires user lookup via auth service)
exports.restrictToAdmin = async (req, res, next) => {
  try {
    // In a microservices architecture, you'd typically:
    // 1. Include role in JWT token, or
    // 2. Call auth service to verify role
    // For now, we'll check if role is in token
    
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - no token',
      });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized - invalid token',
      });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized - admin only',
      });
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(403).json({
      success: false,
      message: 'Not authorized for this action',
    });
  }
};
