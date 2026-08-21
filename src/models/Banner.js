const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tiêu đề banner'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Vui lòng nhập hình ảnh banner'],
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Banner', bannerSchema);
