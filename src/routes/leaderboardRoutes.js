const express = require('express');
const router = express.Router();
const {
  getGlobalLeaderboard,
  getGameLeaderboard,
  submitScore,
} = require('../controllers/leaderboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/global', getGlobalLeaderboard);
router.get('/game/:gameId', getGameLeaderboard);
router.post('/score', protect, submitScore);

module.exports = router;
