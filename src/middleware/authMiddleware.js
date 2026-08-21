const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Thiếu Bearer token xác thực' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'playverse_jwt_dev_secret_key';
    const decoded = jwt.verify(token, secret);

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Tài khoản không còn tồn tại' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'playverse_jwt_dev_secret_key';
      const decoded = jwt.verify(token, secret);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Proceed unauthenticated on invalid token
    }
  }

  next();
};

module.exports = { protect, optionalAuth };
