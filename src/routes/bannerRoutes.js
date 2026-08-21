const express = require('express');
const router = express.Router();
const {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} = require('../controllers/bannerController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getBanners).post(protect, createBanner);
router.route('/:id').get(getBannerById).put(protect, updateBanner).delete(protect, deleteBanner);

module.exports = router;
