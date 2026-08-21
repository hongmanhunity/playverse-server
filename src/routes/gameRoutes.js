const express = require('express');
const router = express.Router();
const {
  getGames,
  getPopularGames,
  getFlashGames,
  getGameById,
} = require('../controllers/gameController');

router.get('/', getGames);
router.get('/popular', getPopularGames);
router.get('/flash', getFlashGames);
router.get('/:id', getGameById);

module.exports = router;
