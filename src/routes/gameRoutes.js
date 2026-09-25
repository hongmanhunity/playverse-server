const express = require('express');
const router = express.Router();
const { getGames, getPopularGames, getFlashGames, getGameById, createGame, updateGame, deleteGame } = require('../controllers/gameController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/popular', getPopularGames);
router.get('/flash', getFlashGames);

router.route('/')
  .get(getGames)
  .post(protect, authorize('admin'), createGame);

router.route('/:id')
  .get(getGameById)
  .put(protect, authorize('admin'), updateGame)
  .delete(protect, authorize('admin'), deleteGame);

module.exports = router;
