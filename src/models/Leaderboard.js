const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      default: null, // null nếu là bảng xếp hạng chung toàn hệ thống
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    rank: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Chỉ mục kép tối ưu tốc độ truy vấn BXH: lọc theo game và sort điểm giảm dần
leaderboardSchema.index({ game: 1, score: -1 });

// Mỗi user chỉ có 1 bản ghi điểm cho 1 game (hoặc game: null toàn cầu)
leaderboardSchema.index({ user: 1, game: 1 }, { unique: true });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
