const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate game in user wishlist
wishlistSchema.index({ user: 1, game: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
