const express = require('express');
const router = express.Router();
const { getReviewsByGame, addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { reviewLimiter } = require('../middleware/rateLimitMiddleware');

router.get('/game/:gameId', getReviewsByGame);
router.post('/game/:gameId', protect, reviewLimiter, addReview);

module.exports = router;
