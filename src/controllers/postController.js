const Post = require('../models/Post');
const PostComment = require('../models/PostComment');
const asyncHandler = require('../utils/asyncHandler');

const getPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [total, posts] = await Promise.all([
    Post.countDocuments(),
    Post.find()
      .populate('user', 'username avatar level')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
  ]);

  res.json({
    success: true,
    count: posts.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    data: posts,
  });
});

const createPost = asyncHandler(async (req, res) => {
  const { title, content, gameTitle } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Tiêu đề và nội dung bài viết không được để trống' });
  }

  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để tạo bài viết' });
  }

  const post = await Post.create({
    user: req.user._id,
    authorName: req.user.username || 'PlayVerse Gamer',
    authorAvatar: req.user.avatar || '',
    gameTitle: gameTitle || 'Chung',
    title: title.trim(),
    content: content.trim(),
  });

  res.status(201).json({
    success: true,
    data: post,
  });
});

const toggleLikePost = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để tương tác' });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
  }

  const userIdStr = req.user._id.toString();
  const alreadyLiked = post.likes.some((id) => id.toString() === userIdStr);

  if (alreadyLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== userIdStr);
    post.likesCount = Math.max(0, post.likesCount - 1);
  } else {
    post.likes.push(req.user._id);
    post.likesCount += 1;
  }

  await post.save();

  res.json({
    success: true,
    likesCount: post.likesCount,
    isLiked: !alreadyLiked,
  });
});

const getPostComments = asyncHandler(async (req, res) => {
  const comments = await PostComment.find({ post: req.params.id })
    .populate('user', 'username avatar level')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: comments.length,
    data: comments,
  });
});

const addPostComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, message: 'Nội dung bình luận không được để trống' });
  }

  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Bạn cần đăng nhập để bình luận' });
  }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
  }

  const comment = await PostComment.create({
    post: post._id,
    user: req.user._id,
    authorName: req.user.username || 'PlayVerse Gamer',
    authorAvatar: req.user.avatar || '',
    content: content.trim(),
  });

  post.commentsCount += 1;
  await post.save();

  res.status(201).json({
    success: true,
    data: comment,
  });
});

module.exports = {
  getPosts,
  createPost,
  toggleLikePost,
  getPostComments,
  addPostComment,
};
