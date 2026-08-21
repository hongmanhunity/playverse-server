const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  levelNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  puzzles: {
    type: Number,
    default: 10,
  },
  rewardPoints: {
    type: String,
    default: '1.0k',
  },
});

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Vui lòng nhập tên Game'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    publisher: {
      type: String,
      required: [true, 'Vui lòng nhập nhà phát hành'],
      default: 'PlayVerse Studio',
    },
    category: {
      type: String,
      required: true,
      default: 'Action',
      index: true,
    },
    tags: [
      {
        type: String,
        index: true,
      },
    ],
    description: {
      type: String,
      default: 'Chưa có mô tả cho tựa game này.',
    },
    price: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    size: {
      type: String,
      default: '1.0 GB',
    },
    downloads: {
      type: String,
      default: '1M+',
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    heroBanner: {
      type: String,
    },
    screenshots: [
      {
        type: String,
      },
    ],
    levels: [levelSchema],
  },
  {
    timestamps: true,
  }
);

gameSchema.pre('save', function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Game', gameSchema);
