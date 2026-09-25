const Game = require('../models/Game');
const Review = require('../models/Review');
const Wishlist = require('../models/Wishlist');
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

const createGame = asyncHandler(async (req, res) => {
  const { title, thumbnail } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Tên game không được để trống' });
  }

  if (!thumbnail || !thumbnail.trim()) {
    return res.status(400).json({ success: false, message: 'Ảnh đại diện thumbnail là bắt buộc' });
  }

  const existingGame = await Game.findOne({ title: title.trim() });
  if (existingGame) {
    return res.status(400).json({ success: false, message: 'Tựa game này đã tồn tại trong kho' });
  }

  const game = await Game.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Thêm game mới thành công',
    data: game,
  });
});

const updateGame = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.body.title) {
    req.body.slug = req.body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  const game = await Game.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!game) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy tựa game để cập nhật' });
  }

  res.json({
    success: true,
    message: 'Cập nhật game thành công',
    data: game,
  });
});

const deleteGame = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const game = await Game.findById(id);
  if (!game) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy tựa game để xóa' });
  }

  await Promise.all([
    Game.findByIdAndDelete(id),
    Review.deleteMany({ game: id }),
    Wishlist.deleteMany({ game: id }),
  ]);

  res.json({
    success: true,
    message: 'Xóa game và toàn bộ dữ liệu liên quan thành công',
  });
});

module.exports = {
  getGames,
  getPopularGames,
  getFlashGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
};
