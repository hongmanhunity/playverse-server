const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'playverse_jwt_dev_secret_key';
  const expiresIn = process.env.JWT_EXPIRE || '30d';

  return jwt.sign({ id }, secret, { expiresIn });
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, avatar } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp username, email và password' });
  }

  const cleanUsername = username.trim();
  const cleanEmail = email.trim().toLowerCase();

  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  if (!usernameRegex.test(cleanUsername)) {
    return res.status(400).json({
      success: false,
      message: 'Tên đăng nhập từ 3-30 ký tự và chỉ chứa chữ cái, số, dấu gạch dưới',
    });
  }

  if (!isValidEmail(cleanEmail)) {
    return res.status(400).json({ success: false, message: 'Định dạng email không hợp lệ' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' });
  }

  const userExists = await User.findOne({ $or: [{ email: cleanEmail }, { username: cleanUsername }] });
  if (userExists) {
    return res.status(400).json({ success: false, message: 'Email hoặc Tên đăng nhập đã được sử dụng' });
  }

  const user = await User.create({
    username: cleanUsername,
    email: cleanEmail,
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

  const cleanEmail = email.trim().toLowerCase();
  if (!isValidEmail(cleanEmail)) {
    return res.status(400).json({ success: false, message: 'Định dạng email không hợp lệ' });
  }

  const user = await User.findOne({ email: cleanEmail }).select('+password');
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
  const { idToken, email: devEmail, name: devName, avatar: devAvatar, googleId: devGoogleId } = req.body;

  let email, name, avatar, googleId;

  if (idToken) {
    try {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID || undefined,
      });
      const payload = ticket.getPayload();

      if (!payload || !payload.email_verified) {
        return res.status(401).json({ success: false, message: 'Tài khoản Google chưa được xác minh' });
      }

      email = payload.email;
      name = payload.name;
      avatar = payload.picture;
      googleId = payload.sub;
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Token xác thực Google không hợp lệ hoặc đã hết hạn' });
    }
  } else if (process.env.NODE_ENV !== 'production' && devEmail) {
    email = devEmail;
    name = devName;
    avatar = devAvatar;
    googleId = devGoogleId;
  } else {
    return res.status(400).json({ success: false, message: 'Thiếu idToken xác thực từ Google' });
  }

  const cleanEmail = email.toLowerCase().trim();
  let user = await User.findOne({ email: cleanEmail });

  if (!user) {
    const baseUsername = name
      ? name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
      : cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const generatedUsername = `${baseUsername}_${Math.floor(1000 + Math.random() * 9000)}`;

    const randomPassword = `Gg_${Math.random().toString(36).slice(-8)}!Pass`;

    user = await User.create({
      username: generatedUsername,
      email: cleanEmail,
      password: randomPassword,
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      googleId: googleId || undefined,
    });
  } else if (googleId && !user.googleId) {
    user.googleId = googleId;
    await user.save();
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

const updateProfile = asyncHandler(async (req, res) => {
  const { avatar } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
  }

  if (avatar && avatar.trim()) {
    user.avatar = avatar.trim();
  }

  await user.save();

  res.json({
    success: true,
    message: 'Cập nhật thông tin thành công',
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      points: user.points,
      level: user.level,
      role: user.role,
    },
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới',
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Mật khẩu mới phải có ít nhất 6 ký tự',
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Mật khẩu mới không được trùng với mật khẩu hiện tại',
    });
  }

  const user = await User.findById(req.user._id).select('+password');
  if (!user || !(await user.matchPassword(currentPassword))) {
    return res.status(401).json({
      success: false,
      message: 'Mật khẩu hiện tại không chính xác',
    });
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Đổi mật khẩu thành công',
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  googleAuth,
  updateProfile,
  changePassword,
};
