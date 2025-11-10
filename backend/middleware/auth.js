const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!authHeader || !token) {
      console.warn(`Auth: Missing Authorization header or token for ${req.method} ${req.originalUrl} from ${req.ip}`);
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.warn(`Auth: Token valid but no user found for id ${decoded.id} on ${req.method} ${req.originalUrl}`);
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    // Distinguish common JWT errors for better debugging
    if (error.name === 'TokenExpiredError') {
      console.warn(`Auth: Token expired for request ${req.method} ${req.originalUrl} from ${req.ip}`);
      return res.status(401).json({ success: false, message: 'Token expired' });
    }

    if (error.name === 'JsonWebTokenError') {
      console.warn(`Auth: Invalid token for request ${req.method} ${req.originalUrl} from ${req.ip} - ${error.message}`);
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    console.error('Auth middleware error:', error);
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

const adminAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const allowedRoles = ['ADMIN', 'MODERATOR'];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions to access admin resources'
    });
  }

  next();
};

module.exports = { auth, adminAuth };