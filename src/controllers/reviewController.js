const Review = require('../models/Review');
const Game = require('../models/Game');
const asyncHandler = require('../utils/asyncHandler');

const getReviewsByGame = asyncHandler(async (req, res) => {
  const { gameId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [total, reviews] = await Promise.all([
    Review.countDocuments({ game: gameId }),
    Review.find({ game: gameId })
      .populate('user', 'username avatar level')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
  ]);

  res.json({
    success: true,
    count: reviews.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    data: reviews,
  });
});

const addReview = asyncHandler(async (req, res) => {
  const { gameId } = req.params;
  const { rating, comment } = req.body;

  const numericRating = Number(rating);
  if (!rating || Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ success: false, message: 'Số sao đánh giá phải từ 1 đến 5' });
  }

  if (!comment || !comment.trim()) {
    return res.status(400).json({ success: false, message: 'Nội dung bình luận không được để trống' });
  }

  const game = await Game.findById(gameId);
  if (!game) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy tựa game này' });
  }

  let review = await Review.findOne({ game: gameId, user: req.user._id });

  if (review) {
    review.rating = numericRating;
    review.comment = comment.trim();
    await review.save();
  } else {
    review = await Review.create({
      game: gameId,
      user: req.user._id,
      rating: numericRating,
      comment: comment.trim(),
    });
  }

  const stats = await Review.aggregate([
    { $match: { game: game._id } },
    { $group: { _id: '$game', averageRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    game.averageRating = Math.round(stats[0].averageRating * 10) / 10;
    game.reviewCount = stats[0].count;
    await game.save();
  }

  await review.populate('user', 'username avatar level');

  res.status(201).json({
    success: true,
    message: 'Gửi đánh giá thành công',
    data: review,
    gameRating: {
      averageRating: game.averageRating,
      reviewCount: game.reviewCount,
    },
  });
});

module.exports = {
  getReviewsByGame,
  addReview,
};
