const Banner = require('../models/Banner');
const asyncHandler = require('../utils/asyncHandler');

const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find()
    .populate('gameId', 'title category thumbnail heroBanner')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: banners.length,
    data: banners,
  });
});

const getBannerById = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id).populate('gameId');

  if (!banner) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy banner',
    });
  }

  res.json({
    success: true,
    data: banner,
  });
});

const createBanner = asyncHandler(async (req, res) => {
  const { title, image, gameId } = req.body;

  if (!title || !image) {
    return res.status(400).json({
      success: false,
      message: 'Tiêu đề và hình ảnh banner là bắt buộc',
    });
  }

  const banner = await Banner.create({
    title: title.trim(),
    image: image.trim(),
    gameId: gameId || null,
  });

  res.status(201).json({
    success: true,
    message: 'Tạo banner thành công',
    data: banner,
  });
});

const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!banner) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy banner để cập nhật',
    });
  }

  res.json({
    success: true,
    message: 'Cập nhật banner thành công',
    data: banner,
  });
});

const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);

  if (!banner) {
    return res.status(404).json({
      success: false,
      message: 'Không tìm thấy banner để xóa',
    });
  }

  res.json({
    success: true,
    message: 'Xóa banner thành công',
  });
});

module.exports = {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
};
