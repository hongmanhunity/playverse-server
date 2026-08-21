const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'playverse_jwt_dev_secret_key';
  const expiresIn = process.env.JWT_EXPIRE || '30d';

  return jwt.sign({ id }, secret, { expiresIn });
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, avatar } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp username, email và password' });
  }

  const userExists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
  if (userExists) {
    return res.status(400).json({ success: false, message: 'Email hoặc Tên đăng nhập đã được sử dụng' });
  }

  const user = await User.create({
    username,
    email: email.toLowerCase(),
    password,
    avatar: avatar || undefined,
  });

  res.status(201).json({
    success: true,
    message: 'Đăng ký tài khoản thành công',
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      points: user.points,
      level: user.level,
      token: generateToken(user._id),
    },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập email và password' });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Email hoặc Mật khẩu không chính xác' });
  }

  res.json({
    success: true,
    message: 'Đăng nhập thành công',
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      points: user.points,
      level: user.level,
      token: generateToken(user._id),
    },
  });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
  }
  res.json({
    success: true,
    data: user,
  });
});

const googleAuth = asyncHandler(async (req, res) => {
  const { email, name, avatar, googleId } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email Google là bắt buộc' });
  }

  let user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    const baseUsername = name
      ? name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
      : email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const generatedUsername = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;

    const randomPassword = `Gg_${Math.random().toString(36).slice(-8)}!Pass`;

    user = await User.create({
      username: generatedUsername,
      email: email.toLowerCase(),
      password: randomPassword,
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      googleId: googleId || undefined,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Đăng nhập Google thành công',
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      points: user.points,
      level: user.level,
      token: generateToken(user._id),
    },
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  googleAuth,
};
