const express = require('express');
const router = express.Router();
const {
  getPosts,
  createPost,
  toggleLikePost,
  getPostComments,
  addPostComment,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPosts);
router.post('/', protect, createPost);
router.post('/:id/like', protect, toggleLikePost);
router.get('/:id/comments', getPostComments);
router.post('/:id/comments', protect, addPostComment);

module.exports = router;
