const Game = require('../models/Game');
const asyncHandler = require('../utils/asyncHandler');

const getGames = asyncHandler(async (req, res) => {
  const { search, category, tag, sort, page = 1, limit = 20 } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search.trim(), $options: 'i' } },
      { category: { $regex: search.trim(), $options: 'i' } },
    ];
  }

  if (category) {
    query.category = { $regex: category.trim(), $options: 'i' };
  }

  if (tag) {
    query.tags = tag;
  }

  const sortMap = {
    rating: { averageRating: -1 },
    'price-low': { price: 1 },
    'price-high': { price: -1 },
    discount: { discount: -1 },
  };

  const sortOptions = sortMap[sort] || { createdAt: -1 };

  const skip = (pageNum - 1) * limitNum;
  const [total, games] = await Promise.all([
    Game.countDocuments(query),
    Game.find(query).sort(sortOptions).skip(skip).limit(limitNum),
  ]);

  res.json({
    success: true,
    count: games.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    data: games,
  });
});

const getPopularGames = asyncHandler(async (req, res) => {
  const games = await Game.find({ tags: 'Popular' }).limit(10);
  res.json({
    success: true,
    count: games.length,
    data: games,
  });
});

const getFlashGames = asyncHandler(async (req, res) => {
  const games = await Game.find({ $or: [{ tags: 'Flash' }, { discount: { $gt: 0 } }] }).limit(10);
  res.json({
    success: true,
    count: games.length,
    data: games,
  });
});

const getGameById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);

  const game = isObjectId ? await Game.findById(id) : await Game.findOne({ slug: id });

  if (!game) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy tựa game này' });
  }

  res.json({
    success: true,
    data: game,
  });
});

module.exports = {
  getGames,
  getPopularGames,
  getFlashGames,
  getGameById,
};
