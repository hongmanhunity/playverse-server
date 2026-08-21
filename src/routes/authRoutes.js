const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, googleAuth } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.get('/me', protect, getUserProfile);

module.exports = router;
