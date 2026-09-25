const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  res.json({
    success: true,
    count: notifications.length,
    data: notifications,
  });
});

// @desc    Tạo thông báo mới
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = asyncHandler(async (req, res) => {
  const { titleText, message, type, badge, imageUrl } = req.body;

  if (!titleText || !message) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp tiêu đề và nội dung thông báo' });
  }

  const notification = await Notification.create({
    titleText: titleText.trim(),
    message: message.trim(),
    type: type || 'system',
    badge: badge || 'MỚI',
    imageUrl: imageUrl || '',
  });

  res.status(201).json({
    success: true,
    message: 'Tạo thông báo thành công',
    data: notification,
  });
});

// @desc    Xóa thông báo
// @route   DELETE /api/notifications/:id
// @access  Private/Admin
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);

  if (!notification) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy thông báo để xóa' });
  }

  res.json({
    success: true,
    message: 'Xóa thông báo thành công',
  });
});

module.exports = {
  getNotifications,
  createNotification,
  deleteNotification,
};
