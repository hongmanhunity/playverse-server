const express = require('express');
const router = express.Router();
const { getGlobalLeaderboard, getGameLeaderboard, submitScore } = require('../controllers/leaderboardController');
const { protect } = require('../middleware/authMiddleware');
const { scoreLimiter } = require('../middleware/rateLimitMiddleware');

router.get('/global', getGlobalLeaderboard);
router.get('/game/:gameId', getGameLeaderboard);
router.post('/score', protect, scoreLimiter, submitScore);

module.exports = router;
