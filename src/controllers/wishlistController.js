const Wishlist = require('../models/Wishlist');
const Game = require('../models/Game');
const asyncHandler = require('../utils/asyncHandler');

const getWishlist = asyncHandler(async (req, res) => {
  const wishlistItems = await Wishlist.find({ user: req.user._id }).populate('game');
  const games = wishlistItems.map((item) => item.game).filter((g) => g !== null);

  res.json({
    success: true,
    count: games.length,
    data: games,
  });
});

const toggleWishlist = asyncHandler(async (req, res) => {
  const { gameId } = req.params;

  const game = await Game.findById(gameId);
  if (!game) {
    return res.status(404).json({ success: false, message: 'Game không tồn tại' });
  }

  const existing = await Wishlist.findOne({ user: req.user._id, game: gameId });

  if (existing) {
    await Wishlist.findByIdAndDelete(existing._id);
    return res.json({
      success: true,
      isWishlisted: false,
      message: 'Đã xóa game khỏi danh sách yêu thích',
    });
  }

  await Wishlist.create({
    user: req.user._id,
    game: gameId,
  });

  return res.status(201).json({
    success: true,
    isWishlisted: true,
    message: 'Đã thêm game vào danh sách yêu thích',
  });
});

module.exports = {
  getWishlist,
  toggleWishlist,
};
