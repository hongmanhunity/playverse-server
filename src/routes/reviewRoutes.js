const express = require('express');
const router = express.Router();
const { getReviewsByGame, addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/game/:gameId', getReviewsByGame);
router.post('/game/:gameId', protect, addReview);

module.exports = router;
