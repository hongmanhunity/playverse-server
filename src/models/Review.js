const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Vui lòng chọn số sao đánh giá (1-5)'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Vui lòng nhập nội dung bình luận'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate review per game per user
reviewSchema.index({ game: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
