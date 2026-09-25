const express = require('express');
const router = express.Router();
const { getBanners, getBannerById, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(getBanners).post(protect, authorize('admin'), createBanner);
router
  .route('/:id')
  .get(getBannerById)
  .put(protect, authorize('admin'), updateBanner)
  .delete(protect, authorize('admin'), deleteBanner);

module.exports = router;
