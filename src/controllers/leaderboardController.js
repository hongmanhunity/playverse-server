const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const getGlobalLeaderboard = asyncHandler(async (req, res) => {
  const leaderboards = await Leaderboard.find({ game: null })
    .populate('user', 'username avatar points level')
    .sort({ score: -1 })
    .limit(50);

  const formatted = leaderboards
    .filter((item) => item.user !== null)
    .map((item, index) => ({
      rank: index + 1,
      score: item.score,
      user: item.user,
      updatedAt: item.updatedAt,
    }));

  res.json({
    success: true,
    count: formatted.length,
    data: formatted,
  });
});

const getGameLeaderboard = asyncHandler(async (req, res) => {
  const { gameId } = req.params;

  const leaderboards = await Leaderboard.find({ game: gameId })
    .populate('user', 'username avatar level')
    .sort({ score: -1 })
    .limit(50);

  const formatted = leaderboards
    .filter((item) => item.user !== null)
    .map((item, index) => ({
      rank: index + 1,
      score: item.score,
      user: item.user,
      updatedAt: item.updatedAt,
    }));

  res.json({
    success: true,
    count: formatted.length,
    data: formatted,
  });
});

const submitScore = asyncHandler(async (req, res) => {
  const { gameId, score } = req.body;
  const numericScore = Number(score);

  if (score === undefined || Number.isNaN(numericScore) || numericScore < 0) {
    return res.status(400).json({ success: false, message: 'Điểm số cung cấp không hợp lệ' });
  }

  let globalLb = await Leaderboard.findOne({ user: req.user._id, game: null });
  if (globalLb) {
    if (numericScore > globalLb.score) {
      globalLb.score = numericScore;
      await globalLb.save();
    }
  } else {
    globalLb = await Leaderboard.create({
      user: req.user._id,
      game: null,
      score: numericScore,
    });
  }

  let gameLb = null;
  if (gameId) {
    gameLb = await Leaderboard.findOne({ user: req.user._id, game: gameId });
    if (gameLb) {
      if (numericScore > gameLb.score) {
        gameLb.score = numericScore;
        await gameLb.save();
      }
    } else {
      gameLb = await Leaderboard.create({
        user: req.user._id,
        game: gameId,
        score: numericScore,
      });
    }
  }

  await User.findByIdAndUpdate(req.user._id, { $inc: { points: Math.floor(numericScore / 10) } });

  res.json({
    success: true,
    message: 'Cập nhật điểm số thành công',
    data: {
      globalScore: globalLb.score,
      gameScore: gameLb ? gameLb.score : null,
    },
  });
});

module.exports = {
  getGlobalLeaderboard,
  getGameLeaderboard,
  submitScore,
};
