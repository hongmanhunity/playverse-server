const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    titleText: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['promotion', 'system', 'event'],
      default: 'system',
    },
    badge: {
      type: String,
      default: 'HOT',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
