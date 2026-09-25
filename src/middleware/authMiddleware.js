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

//Middleware riêng cho Admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  }
  else {
    return res.status(403).json({
      success: false,
      message: 'Quyền truy cập bị từ chối: Yêu cầu quyền quản trị viên (Admin)'
    });
  }
};

// Middleware phân quyền theo vai trò
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Quyền truy cập bị từ chối: tài khoản của bạn (${req.user ? req.user.role : 'khách'}) không có quyền thực hiện thao tác này`,
      });
    }
    next();
  };
};

module.exports = { protect, optionalAuth, authorize };
