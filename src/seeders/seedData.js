const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Game = require('../models/Game');
const Banner = require('../models/Banner');
const Review = require('../models/Review');
const Leaderboard = require('../models/Leaderboard');
const Wishlist = require('../models/Wishlist');
const Post = require('../models/Post');
const PostComment = require('../models/PostComment');
const Notification = require('../models/Notification');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/playverse');
    console.log('[Seed DB] Connected to MongoDB');
  } catch (err) {
    console.error(`[Seed DB Error] ${err.message}`);
    process.exit(1);
  }
};

const usersData = [
  {
    username: 'alex_gamer',
    email: 'alex@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    points: 15400,
    level: 15,
  },
  {
    username: 'sarah_play',
    email: 'sarah@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    points: 12800,
    level: 12,
  },
  {
    username: 'progamer99',
    email: 'pro@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=300&q=80',
    points: 24500,
    level: 25,
  },
  {
    username: 'shadow_knight',
    email: 'shadow@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    points: 8900,
    level: 9,
  },
  {
    username: 'playmaster',
    email: 'master@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    points: 31000,
    level: 30,
  },
];

// Danh sách tròn TRÒN 30 GAME STEAM BOM TẤN - 100% Link Steam Akamai CDN
const rawGamesData = [
  {
    title: 'Counter-Strike 2',
    publisher: 'Valve',
    category: 'Tactical FPS - Esports - Action',
    tags: ['Popular', 'Featured', 'Wishlist'],
    description: 'Huyền thoại bắn súng chiến thuật góc nhìn thứ nhất số 1 thế giới nâng cấp lên Source 2.',
    price: 0,
    discount: 50,
    size: '30 GB',
    downloads: '500M+',
    averageRating: 4.7,
    reviewCount: 22000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/ss_796601d9d67faf53486eeb26d0724347cea67ddc.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/ss_d830cfd0550fbb64d80e803e93c929c3abb02056.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/ss_13bb35638c0267759276f511ee97064773b37a51.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/ss_0f8cf82d019c614760fd20801f2bb4001da7ea77.1920x1080.jpg'
    ],
    levels: [
      { levelNumber: 1, title: 'Dust II Veteran', puzzles: 10, rewardPoints: '4.9k' },
      { levelNumber: 2, title: 'Mirage Master', puzzles: 20, rewardPoints: '3.8k' },
      { levelNumber: 3, title: 'Inferno Tactician', puzzles: 30, rewardPoints: '2.4k' },
      { levelNumber: 4, title: 'Global Elite', puzzles: 40, rewardPoints: '5.0k' },
    ],
  },
  {
    title: 'Dota 2',
    publisher: 'Valve',
    category: 'MOBA - Strategy - Esports',
    tags: ['Popular', 'Featured'],
    description: 'Đấu trường MOBA 5v5 kinh điển với chiến thuật chiều sâu bậc nhất mọi thời đại.',
    price: 0,
    discount: 0,
    size: '15 GB',
    downloads: '500M+',
    averageRating: 4.6,
    reviewCount: 28000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/570/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/570/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/570/ss_ad8eee787704745ccdecdfde3a5cd2733704898d.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/570/ss_7ab506679d42bfc0c0e40639887176494e0466d9.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/570/ss_c9118375a2400278590f29a3537769c986ef6e39.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/570/ss_f9ebafedaf2d5cfb80ef1f74baa18eb08cad6494.1920x1080.jpg'
    ],
    levels: [
      { levelNumber: 1, title: 'Laning Phase', puzzles: 5, rewardPoints: '1.2k' },
      { levelNumber: 2, title: 'Roshan Slayer', puzzles: 15, rewardPoints: '3.0k' },
    ],
  },
  {
    title: 'PUBG: BATTLEGROUNDS',
    publisher: 'Krafton',
    category: 'Battle Royale - FPS - Survival',
    tags: ['Popular', 'Featured'],
    description: 'Nhảy dù xuống hòn đảo sinh tồn, tìm kiếm trang bị và trở thành người sống sót duy nhất!',
    price: 0,
    discount: 0,
    size: '30 GB',
    downloads: '1B+',
    averageRating: 4.5,
    reviewCount: 35000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/578080/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/578080/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/578080/c16e2f2d122cae77a1cbaca19263df0f2d2214fa/ss_c16e2f2d122cae77a1cbaca19263df0f2d2214fa.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/578080/aa1c51a9b45c88e770b443d8d3cd28f3024b0760/ss_aa1c51a9b45c88e770b443d8d3cd28f3024b0760.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/578080/bf9b3de5896d4ec7ef9531938b26946cded81fdf/ss_bf9b3de5896d4ec7ef9531938b26946cded81fdf.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/578080/faa4f9f6caa9613f07fd1193a143f66e0fac489c/ss_faa4f9f6caa9613f07fd1193a143f66e0fac489c.1920x1080.jpg'
    ],
  },
  {
    title: 'Apex Legends',
    publisher: 'Electronic Arts',
    category: 'Battle Royale - FPS - Action',
    tags: ['Popular', 'Featured'],
    description: 'Bắn súng sinh tồn nhịp độ nhanh cùng kĩ năng huyền thoại độc đáo từ Respawn Entertainment.',
    price: 0,
    discount: 0,
    size: '40 GB',
    downloads: '100M+',
    averageRating: 4.6,
    reviewCount: 18000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/3fc2dfcf0e8d7d7202a3ca32ae26c7afaec723e2/ss_3fc2dfcf0e8d7d7202a3ca32ae26c7afaec723e2.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/d64ce54903a3ba6429c6e3189ad746a7db70ee3e/ss_d64ce54903a3ba6429c6e3189ad746a7db70ee3e.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/6593905f527d4b1bf01b0bb148b9c9a39616a2e4/ss_6593905f527d4b1bf01b0bb148b9c9a39616a2e4.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/d8a07de4444fb8f43ad19c7aa9e3fa8e26eb94d6/ss_d8a07de4444fb8f43ad19c7aa9e3fa8e26eb94d6.1920x1080.jpg'
    ],
  },
  {
    title: 'Grand Theft Auto V',
    publisher: 'Rockstar Games',
    category: 'Action - Open World - Crime',
    tags: ['Popular', 'Wishlist'],
    description: 'Khám phá thành phố Los Santos đầy biến động cùng 3 nhân vật huyền thoại Michael, Franklin và Trevor.',
    price: 29.99,
    discount: 50,
    size: '90 GB',
    downloads: '200M+',
    averageRating: 4.9,
    reviewCount: 85000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/ss_32aa18ab3175e3002217862dd5917646d298ab6b.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/ss_2744f112fa060320d191a50e8b3a92441a648a56.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/ss_da39c16db175f6973770bae6b91d411251763152.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/ss_bd5db78286be0a7c6b2c62519099a9e27e6b06f3.1920x1080.jpg'
    ],
  },
  {
    title: 'Cyberpunk 2077',
    publisher: 'CD PROJEKT RED',
    category: 'Action RPG - Open World - Sci-Fi',
    tags: ['Popular', 'Wishlist'],
    description: 'Trải nghiệm thành phố tương lai Night City ngập tràn ánh đèn Neon và những phiêu lưu kịch tính.',
    price: 59.99,
    discount: 40,
    size: '70 GB',
    downloads: '25M+',
    averageRating: 4.7,
    reviewCount: 45000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/ss_2f649b68d579bf87011487d29bc4ccbfdd97d34f.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/ss_0e64170751e1ae20ff8fdb7001a8892fd48260e7.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/ss_af2804aa4bf35d4251043744412ce3b359a125ef.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/ss_7924f64b6e5d586a80418c9896a1c92881a7905b.1920x1080.jpg'
    ],
  },
  {
    title: 'The Witcher 3: Wild Hunt',
    publisher: 'CD PROJEKT RED',
    category: 'RPG - Open World - Story Rich',
    tags: ['Popular', 'Featured', 'Wishlist'],
    description: 'Hành trình săn quỷ huyền thoại của Geralt xứ Rivia trong thế giới giả tưởng tăm tối và rộng lớn.',
    price: 39.99,
    discount: 75,
    size: '50 GB',
    downloads: '50M+',
    averageRating: 4.9,
    reviewCount: 95000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/ss_5710298af2318afd9aa72449ef29ac4a2ef64d8e.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/ss_0901e64e9d4b8ebaea8348c194e7a3644d2d832d.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/ss_112b1e176c1bd271d8a565eacb6feaf90f240bb2.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/ss_d1b73b18cbcd5e9e412c7a1dead3c5cd7303d2ad.1920x1080.jpg'
    ],
  },
  {
    title: 'Left 4 Dead 2',
    publisher: 'Valve',
    category: 'Co-op - FPS - Zombie',
    tags: ['Popular', 'Wishlist'],
    description: 'Siêu phẩm bắn zombie phối hợp đồng đội 4 người hấp dẫn nhất mọi thời đại.',
    price: 9.99,
    discount: 90,
    size: '13 GB',
    downloads: '100M+',
    averageRating: 4.9,
    reviewCount: 78000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/550/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/550/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/550/ss_2eae29fbdfe8e5e8999b96d8bb28c5db70507968.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/550/ss_29b3b4f2a3994c889f6fc12e0781d9d4726ef33f.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/550/ss_9488e329bb42d792a059fb44cb7135d25b6262f5.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/550/ss_6ec4ee04d4924b099e25ce79f3d6571c3b623b3b.1920x1080.jpg'
    ],
  },
  {
    title: 'Monster Hunter: World',
    publisher: 'CAPCOM',
    category: 'Action RPG - Multiplayer - Co-op',
    tags: ['Popular', 'Featured'],
    description: 'Săn lùng những quái thú khổng lồ trong hệ sinh thái thiên nhiên hùng vĩ cùng bạn bè.',
    price: 29.99,
    discount: 50,
    size: '48 GB',
    downloads: '30M+',
    averageRating: 4.8,
    reviewCount: 62000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/582010/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/582010/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/582010/ss_a262c53b8629de7c6547933dc0b49d31f4e1b1f1.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/582010/ss_6b4986a37c7b5c185a796085c002febcdd5357b5.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/582010/ss_0dfb20f6f09c196bfc317bd517dc430ed6e6a2a4.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/582010/ss_25902a9ae6977d6d10ebff20b87e8739e51c5b8b.1920x1080.jpg'
    ],
  },
  {
    title: 'Elden Ring',
    publisher: 'Bandai Namco Entertainment',
    category: 'Action RPG - Open World - Souls-like',
    tags: ['Popular', 'Featured', 'Wishlist'],
    description: 'Siêu phẩm Game of the Year - Khám phá Vùng Đất Giữa (Vùng Đất Bóng Tối) đầy thử thách khắc nghiệt.',
    price: 59.99,
    discount: 30,
    size: '60 GB',
    downloads: '25M+',
    averageRating: 4.9,
    reviewCount: 110000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/ss_943bf6fe62352757d9070c1d33e50b92fe8539f1.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/ss_dcdac9e4b26ac0ee5248bfd2967d764fd00cdb42.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/ss_3c41384a24d86dddd58a8f61db77f9dc0bfda8b5.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/ss_e0316c76f8197405c1312d072b84331dd735d60b.1920x1080.jpg'
    ],
  },
  {
    title: 'Red Dead Redemption 2',
    publisher: 'Rockstar Games',
    category: 'Open World - Action - Story Rich',
    tags: ['Popular', 'Featured', 'Wishlist'],
    description: 'Tuyệt tác viễn tây theo chân Arthur Morgan và băng nhóm Van der Linde trên con đường sinh tồn.',
    price: 59.99,
    discount: 67,
    size: '120 GB',
    downloads: '40M+',
    averageRating: 4.9,
    reviewCount: 125000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/ss_66b553f4c209476d3e4ce25fa4714002cc914c4f.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/ss_bac60bacbf5da8945103648c08d27d5e202444ca.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/ss_668dafe477743f8b50b818d5bbfcec669e9ba93e.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/ss_4ce07ae360b166f0f650e9a895a3b4b7bf15e34f.1920x1080.jpg'
    ],
  },
  {
    title: 'God of War',
    publisher: 'PlayStation Publishing',
    category: 'Action - Adventure - Mythology',
    tags: ['Popular', 'Wishlist'],
    description: 'Hành trình của Kratos và con trai Atreus trong thế giới thần thoại Bắc Âu hiểm nguy.',
    price: 49.99,
    discount: 50,
    size: '70 GB',
    downloads: '20M+',
    averageRating: 4.9,
    reviewCount: 54000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1593500/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1593500/ss_6eccc970b5de2943546d93d319be1b5c0618f21b.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1593500/ss_f1bff24d3967a21d303d95e11ed892e3d9113057.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1593500/ss_3670ba72c7e3e9c3c3225547ef2c1053504e62b8.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1593500/ss_93a3ca63aa2cd8c675bbb6430324ee3f2d44b845.1920x1080.jpg'
    ],
  },
  {
    title: 'Hades',
    publisher: 'Supergiant Games',
    category: 'Roguelike - Action - Indie',
    tags: ['Popular', 'Wishlist'],
    description: 'Vượt qua Âm phủ Hy Lạp trong tựa game Roguelike hành động xuất sắc bậc nhất.',
    price: 24.99,
    discount: 50,
    size: '15 GB',
    downloads: '15M+',
    averageRating: 4.9,
    reviewCount: 48000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145360/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145360/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145360/ss_c0fed447426b69981cf1721756acf75369801b31.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145360/ss_8a9f0953e8a014bd3df2789c2835cb787cd3764d.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145360/ss_68300459a8c3daacb2ec687adcdbf4442fcc4f47.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145360/ss_bcb499a0dd001f4101823f99ec5094d2872ba6ee.1920x1080.jpg'
    ],
  },
  {
    title: 'Hollow Knight',
    publisher: 'Team Cherry',
    category: 'Metroidvania - 2D - Action',
    tags: ['Popular', 'Wishlist'],
    description: 'Khám phá vương quốc côn trùng cổ xưa Hallownest đầy bí ẩn và thử thách.',
    price: 14.99,
    discount: 50,
    size: '9 GB',
    downloads: '20M+',
    averageRating: 4.9,
    reviewCount: 65000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/ss_5384f9f8b96a0b9934b2bc35a4058376211636d2.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/ss_d5b6edd94e77ba6db31c44d8a3c09d807ab27751.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/ss_a81e4231cc8d55f58b51a4a938898af46503cae5.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/ss_62e10cf506d461e11e050457b08aa0e2a1c078d0.1920x1080.jpg'
    ],
  },
  {
    title: 'Stardew Valley',
    publisher: 'ConcernedApe',
    category: 'Farming Sim - RPG - Cozy',
    tags: ['Popular', 'Featured'],
    description: 'Xây dựng trang trại trong mơ, kết bạn và tận hưởng cuộc sống yên bình tại Ngôi làng Stardew.',
    price: 14.99,
    discount: 20,
    size: '1.5 GB',
    downloads: '30M+',
    averageRating: 4.9,
    reviewCount: 92000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/ss_b887651a93b0525739049eb4194f633de2df75be.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/ss_9ac899fe2cda15d48b0549bba77ef8c4a090a71c.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/ss_4fa0866709ede3753fdf2745349b528d5e8c4054.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/ss_d836f0a5b0447fb6a2bdb0a6ac5f954949d3c41e.1920x1080.jpg'
    ],
  },
  {
    title: 'Palworld',
    publisher: 'Pocketpair',
    category: 'Open World - Survival - Creature Collector',
    tags: ['Popular', 'Featured'],
    description: 'Sinh tồn và thu phục sinh vật kỳ diệu Pal trong thế giới mở tự do.',
    price: 29.99,
    discount: 10,
    size: '40 GB',
    downloads: '25M+',
    averageRating: 4.7,
    reviewCount: 58000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1623730/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1623730/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1623730/ss_f81b7c4f20be3b99f76a1415c4cdb9b444c99b97.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1623730/648ed4266fc18f413292292741304ef648421c55/ss_648ed4266fc18f413292292741304ef648421c55.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1623730/ss_b3cea7c9f04a67d784d4c6a0c157a11d6268b189.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1623730/cd7b46028d10c21db8fc8217192094d309efcebc/ss_cd7b46028d10c21db8fc8217192094d309efcebc.1920x1080.jpg'
    ],
  },
  {
    title: "Baldur's Gate 3",
    publisher: 'Larian Studios',
    category: 'CRPG - Turn-Based - D&D',
    tags: ['Popular', 'Featured', 'Wishlist'],
    description: 'Tựa game GOTY nhập vai D&D đỉnh cao với cốt truyện vô vàn lựa chọn biến hóa.',
    price: 59.99,
    discount: 20,
    size: '150 GB',
    downloads: '20M+',
    averageRating: 4.9,
    reviewCount: 140000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/ss_c73bc54415178c07fef85f54ee26621728c77504.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/ss_73d93bea842b93914d966622104dcb8c0f42972b.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/ss_cf936d31061b58e98e0c646aee00e6030c410cda.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/ss_b6a6ee6e046426d08ceea7a4506a1b5f44181543.1920x1080.jpg'
    ],
  },
  {
    title: 'Dead by Daylight',
    publisher: 'Behaviour Interactive',
    category: 'Horror - Multiplayer - Asymmetrical',
    tags: ['Popular', 'Wishlist'],
    description: 'Trò chơi kinh dị trốn chạy 4v1 sinh tồn kịch tính nghẹt thở.',
    price: 19.99,
    discount: 60,
    size: '50 GB',
    downloads: '40M+',
    averageRating: 4.4,
    reviewCount: 38000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/381210/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/381210/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/381210/5355ac410e985cac27f04b877280a984be4d28a6/ss_5355ac410e985cac27f04b877280a984be4d28a6.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/381210/76776660827b2b6b73afc4a506c1267462cc70ff/ss_76776660827b2b6b73afc4a506c1267462cc70ff.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/381210/141a099b39afb31b864e8eda9570c344ad0c70f5/ss_141a099b39afb31b864e8eda9570c344ad0c70f5.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/381210/30fa7d276001c8b33a60dc1cd8683c6aae5c20b6/ss_30fa7d276001c8b33a60dc1cd8683c6aae5c20b6.1920x1080.jpg'
    ],
  },
  {
    title: 'Terraria',
    publisher: 'Re-Logic',
    category: 'Sandbox - 2D - Survival',
    tags: ['Popular'],
    description: 'Khám phá, đào khoáng sản, chế tạo vũ khí và đánh trùm trong thế giới 2D vô tận.',
    price: 9.99,
    discount: 50,
    size: '1 GB',
    downloads: '50M+',
    averageRating: 4.9,
    reviewCount: 115000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/ss_8c03886f214d2108cafca13845533eaa3d87d83f.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/ss_ae168a00ab08104ba266dc30232654d4b3c919e5.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/ss_9edd98caaf9357c2f40758f354475a56e356e8b0.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/ss_75ea9a7e39eb34b40efa1e6dfd2536098dc4734b.1920x1080.jpg'
    ],
  },
  {
    title: 'Phasmophobia',
    publisher: 'Kinetic Games',
    category: 'Horror - Co-op - VR',
    tags: ['Popular', 'Wishlist'],
    description: 'Trở thành thợ săn ma cùng hội bạn thân khám phá các địa điểm tâm linh kỳ bí.',
    price: 13.99,
    discount: 20,
    size: '21 GB',
    downloads: '20M+',
    averageRating: 4.8,
    reviewCount: 42000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/739630/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/739630/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/739630/ec30a770064ea10c2bcfb1b3002a3dbd086be516/ss_ec30a770064ea10c2bcfb1b3002a3dbd086be516.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/739630/e9b67c7a3744a36cd5cc29adc13c6caaa4172e26/ss_e9b67c7a3744a36cd5cc29adc13c6caaa4172e26.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/739630/1ec54d1d45005e5ddd8360b05e5bbdea3a9090f2/ss_1ec54d1d45005e5ddd8360b05e5bbdea3a9090f2.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/739630/71f1c151812f056bdbf1aa0c0d5779bb12f31a2a/ss_71f1c151812f056bdbf1aa0c0d5779bb12f31a2a.1920x1080.jpg'
    ],
  },
  {
    title: 'Forza Horizon 5',
    publisher: 'Xbox Game Studios',
    category: 'Racing - Open World - Driving',
    tags: ['Popular', 'Featured'],
    description: 'Trải nghiệm đường đua Mexico rực rỡ sắc màu với hàng trăm siêu xe chân thực.',
    price: 59.99,
    discount: 50,
    size: '110 GB',
    downloads: '30M+',
    averageRating: 4.7,
    reviewCount: 52000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551360/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551360/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551360/ss_cf56e25a0290556ba83229eb0ab370d10be0407c.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551360/ss_00f0090174380eeaf8753bd3d1028b6772c3aebf.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551360/ss_b65236b365315ebb6da6114ce42cd74b59cab3c8.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551360/ss_0a13a7ccd38e7c3e6a5f1720050732833b53b6a8.1920x1080.jpg'
    ],
  },
  {
    title: 'Rocket League',
    publisher: 'Psyonix / Epic Games',
    category: 'Racing - Sports - Multiplayer',
    tags: ['Popular', 'Wishlist'],
    description: 'Sự kết hợp hoàn hảo giữa bóng đá và đua xe địa hình nhào lộn!',
    price: 0,
    discount: 0,
    size: '20 GB',
    downloads: '50M+',
    averageRating: 4.4,
    reviewCount: 1800,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252950/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252950/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252950/aec309826d6c6d9b6e8cc18e6d6836965351aaed/ss_aec309826d6c6d9b6e8cc18e6d6836965351aaed.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252950/25076a740a4fcf7eb42356b03d3c955456413339/ss_25076a740a4fcf7eb42356b03d3c955456413339.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252950/9821bcbca5e197fb2e98f98427dae8561f03b272/ss_9821bcbca5e197fb2e98f98427dae8561f03b272.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252950/50ded83633d947340d48c74ba133ed80a335b2b5/ss_50ded83633d947340d48c74ba133ed80a335b2b5.1920x1080.jpg'
    ],
  },
  {
    title: 'The Escapists 2',
    publisher: 'Team17',
    category: 'Adventure - Strategy - Indie',
    tags: ['Wishlist', 'Strategy'],
    description: 'Lên kế hoạch đào tẩu khỏi những nhà tù an ninh nghiêm ngặt nhất thế giới!',
    price: 19.99,
    discount: 20,
    size: '4 GB',
    downloads: '10M+',
    averageRating: 4.8,
    reviewCount: 3100,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/641990/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/641990/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/641990/ss_4c06641e551c04e72abb54d3c190233ff02c05ca.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/641990/ss_75c9e0c479c4fb6cc2a40686685ed26d0488f332.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/641990/ss_2bb6149a553bbc28c85a624f7628f18fb1573860.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/641990/ss_797e85fff36b0c2f5da3caa5028132ab52f3c97c.1920x1080.jpg'
    ],
  },
  {
    title: 'The Long Dark',
    publisher: 'Hinterland Games',
    category: 'Survival - Adventure - Indie',
    tags: ['Wishlist', 'Horror'],
    description: 'Trải nghiệm sinh tồn yên tĩnh trong vùng hoang dã băng giá sau thảm họa từ trường.',
    price: 29.99,
    discount: 15,
    size: '7 GB',
    downloads: '5M+',
    averageRating: 4.3,
    reviewCount: 950,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/305620/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/305620/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/305620/ss_05c7f5d1b2ec2b2a1cf4ca2aa1ff609c7542f6b5.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/305620/ss_6b411930012a9f6794fe32e36504517aa54c3e4c.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/305620/ss_aa8de90a92dca3f6365ad5f18216393047f5b2d8.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/305620/ss_6e8604e40c58acd67071bb2e1a13f22a1f9fd288.1920x1080.jpg'
    ],
  },
  {
    title: 'Yakuza : Like a Dragon',
    publisher: 'SEGA',
    category: 'RPG - Action - Turn-Based',
    tags: ['Wishlist', 'RPG'],
    description: 'Hành trình trỗi dậy của Ichiban Kasuga trong thế giới ngầm Nhật Bản đầy lôi cuốn.',
    price: 59.99,
    discount: 40,
    size: '50 GB',
    downloads: '20M+',
    averageRating: 4.6,
    reviewCount: 6200,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1235140/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1235140/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1235140/ss_3672df00523861cd37b0f969d80604003ba14fd4.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1235140/ss_9cecfb713527a480f607bbde54c01763b18bf354.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1235140/ss_d8bcb8c72368ec09506d3a60d42ff2a1901e39f7.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1235140/ss_23d607ec8ceaca26edc88b6445d92ddcd111fea4.1920x1080.jpg'
    ],
  },
  {
    title: 'Warhammer: Vermintide 2',
    publisher: 'Fatshark',
    category: 'Action - Co-op - Hack and Slash',
    tags: ['Wishlist', 'Action'],
    description: 'Trận chiến chặt chém góc nhìn thứ nhất phối hợp đồng đội tàn khốc.',
    price: 29.99,
    discount: 30,
    size: '85 GB',
    downloads: '15M+',
    averageRating: 4.5,
    reviewCount: 14000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/552500/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/552500/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/552500/ss_6b459fcf2c685275b0963d056113a23b538d1bdf.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/552500/ss_39dc495d3db6f8734550447ab3f22a1ef032aba1.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/552500/ss_82f6e4be1711f1fcd5e6c15687df03a9d96d8f32.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/552500/ss_70bcfe361ea570b0617f0bf0d2604124f9a263e5.1920x1080.jpg'
    ],
  },
  {
    title: 'Call of Duty: Warzone',
    publisher: 'Activision',
    category: 'FPS - Battle Royale - Action',
    tags: ['Popular', 'Featured'],
    description: 'Trải nghiệm chiến trường rực lửa Call of Duty quy mô lớn hoàn toàn miễn phí!',
    price: 0,
    discount: 0,
    size: '100 GB',
    downloads: '100M+',
    averageRating: 4.4,
    reviewCount: 15200,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1938090/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1938090/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1938090/ee5f6b6aebe4dc9e86b49c4e309d361b132df308/ss_ee5f6b6aebe4dc9e86b49c4e309d361b132df308.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1938090/ca97243a998802a38c7cddf195cee327c5760353/ss_ca97243a998802a38c7cddf195cee327c5760353.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1938090/6b8f4040a1e923f036e04d9eb21ecb0f866be57e/ss_6b8f4040a1e923f036e04d9eb21ecb0f866be57e.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1938090/c6f865bd79b76a1fa50c59cd17a68d7837abf0b2/ss_c6f865bd79b76a1fa50c59cd17a68d7837abf0b2.1920x1080.jpg'
    ],
  },
  {
    title: 'Naraka: Bladepoint',
    publisher: '24 Entertainment / NetEase',
    category: 'Action - Battle Royale - Martial Arts',
    tags: ['Popular', 'Featured'],
    description: 'Đấu trường sinh tồn kiếm hiệp nhịp độ cực nhanh lên tới 60 người chơi.',
    price: 0,
    discount: 0,
    size: '35 GB',
    downloads: '50M+',
    averageRating: 4.5,
    reviewCount: 19000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1203220/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1203220/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1203220/c54b4ae1cf41cc13f3912bdd177c1a498b21ea98/ss_c54b4ae1cf41cc13f3912bdd177c1a498b21ea98.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1203220/5ea6e30dd4e21d32479f6215d5ff7bbab72a420e/ss_5ea6e30dd4e21d32479f6215d5ff7bbab72a420e.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1203220/4917f5772fa384d7d2a29702e0479581673448b6/ss_4917f5772fa384d7d2a29702e0479581673448b6.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1203220/dc22eddb8c6ecb1330e6650cafe67c003cdcf243/ss_dc22eddb8c6ecb1330e6650cafe67c003cdcf243.1920x1080.jpg'
    ],
  },
  {
    title: 'Black Desert',
    publisher: 'Pearl Abyss',
    category: 'MMORPG - Open World - Action',
    tags: ['Popular'],
    description: 'Thế giới mở MMORPG đồ họa chân thực và hệ thống chiến đấu đỉnh cao.',
    price: 9.99,
    discount: 50,
    size: '60 GB',
    downloads: '20M+',
    averageRating: 4.6,
    reviewCount: 8900,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/582660/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/582660/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/582660/082bffb182e709f0d7c32b30c9319cc8a47ca5e1/ss_082bffb182e709f0d7c32b30c9319cc8a47ca5e1.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/582660/ss_a4c2348412fec008a7dadacb52793bc2f6185f26.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/582660/ss_e8cf6710f8ab86f933d0e212e2d2b0e620cb70c9.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/582660/ss_dc2ae224ccbb7b7825c8b020ba202be065c6021a.1920x1080.jpg'
    ],
  },
  {
    title: 'The Mageseeker: A LoL Story',
    publisher: 'Riot Forge / Riot Games',
    category: 'Action RPG - Pixel Art - Fantasy',
    tags: ['Flash', 'Popular'],
    description: 'Hành trình tự do của Sylas trong vũ trụ Liên Minh Huyền Thoại.',
    price: 29.99,
    discount: 30,
    size: '15 GB',
    downloads: '5M+',
    averageRating: 4.6,
    reviewCount: 6000,
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1457080/header.jpg',
    heroBanner: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1457080/capsule_616x353.jpg',
    screenshots: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1457080/ss_2addb4ccea7211a4a9a4e830f61cf87b172351f1.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1457080/ss_5260508c5752fd105883be68adce43c5a0d57821.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1457080/ss_49699386f7a69741ccb73e41a955e41aef8e67f8.1920x1080.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1457080/ss_d7535363195413c89aa6c1e1d471a292054d2955.1920x1080.jpg'
    ],
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    console.log('[Seed DB] Clearing old collections...');
    await User.deleteMany({});
    await Game.deleteMany({});
    await Banner.deleteMany({});
    await Review.deleteMany({});
    await Leaderboard.deleteMany({});
    await Wishlist.deleteMany({});
    await Post.deleteMany({});
    await PostComment.deleteMany({});
    await Notification.deleteMany({});

    console.log('[Seed DB] Inserting users...');
    const createdUsers = [];
    for (const u of usersData) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`[Seed DB] Created ${createdUsers.length} users.`);

    console.log('[Seed DB] Inserting games...');
    const createdGames = [];
    for (const gameItem of rawGamesData) {
      const slug = gameItem.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      const game = await Game.create({ ...gameItem, slug });
      createdGames.push(game);
    }
    console.log(`[Seed DB] Created ${createdGames.length} Steam games.`);

    const cs2Game = createdGames.find((g) => g.title.includes('Counter-Strike'));
    const witcherGame = createdGames.find((g) => g.title.includes('Witcher'));
    const eldenRingGame = createdGames.find((g) => g.title.includes('Elden Ring'));
    const cyberpunkGame = createdGames.find((g) => g.title.includes('Cyberpunk'));
    const rdr2Game = createdGames.find((g) => g.title.includes('Red Dead'));
    const gtaVGame = createdGames.find((g) => g.title.includes('Grand Theft Auto'));
    const godOfWarGame = createdGames.find((g) => g.title.includes('God of War'));
    const narakaGame = createdGames.find((g) => g.title.toLowerCase().includes('naraka'));

    console.log('[Seed DB] Inserting Banners...');
    const bannersData = [
      {
        title: 'NARAKA: BLADEPOINT - Showdown',
        image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1203220/capsule_616x353.jpg',
        gameId: narakaGame ? narakaGame._id : null,
      },
      {
        title: 'God of War: Ragnarök',
        image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1593500/capsule_616x353.jpg',
        gameId: godOfWarGame ? godOfWarGame._id : null,
      },
      {
        title: 'Cyberpunk 2077: Phantom Liberty',
        image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/capsule_616x353.jpg',
        gameId: cyberpunkGame ? cyberpunkGame._id : null,
      },
      {
        title: 'Red Dead Redemption 2',
        image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/capsule_616x353.jpg',
        gameId: rdr2Game ? rdr2Game._id : null,
      },
      {
        title: 'Grand Theft Auto V: Premium Edition',
        image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/capsule_616x353.jpg',
        gameId: gtaVGame ? gtaVGame._id : null,
      },
      {
        title: 'Counter-Strike 2 Esports Tournament',
        image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/capsule_616x353.jpg',
        gameId: cs2Game ? cs2Game._id : null,
      },
    ];
    await Banner.insertMany(bannersData);
    console.log(`[Seed DB] Created ${bannersData.length} official key-art game banners.`);

    console.log('[Seed DB] Inserting sample reviews...');
    const reviewsData = [
      {
        game: cs2Game._id,
        user: createdUsers[0]._id,
        rating: 5,
        comment: 'Game bắn súng chiến thuật số 1, đồ họa Source 2 nâng cấp quá mượt!',
      },
      {
        game: cs2Game._id,
        user: createdUsers[1]._id,
        rating: 4,
        comment: 'Bắn rất đã tay, hiệu ứng khói vật lý cực kì chân thực.',
      },
      {
        game: witcherGame._id,
        user: createdUsers[2]._id,
        rating: 5,
        comment: 'Siêu phẩm RPG xuất sắc nhất thế kỉ, cốt truyện quá cảm động!',
      },
      {
        game: witcherGame._id,
        user: createdUsers[3]._id,
        rating: 5,
        comment: 'Thế giới mở rộng lớn, tuyến nhiệm vụ phụ cực kì chăm chút.',
      },
    ];
    await Review.insertMany(reviewsData);
    console.log(`[Seed DB] Created ${reviewsData.length} reviews.`);

    console.log('[Seed DB] Inserting leaderboards...');
    const leaderboardData = [
      { user: createdUsers[4]._id, score: 98500, rank: 1 },
      { user: createdUsers[2]._id, score: 87400, rank: 2 },
      { user: createdUsers[0]._id, score: 65200, rank: 3 },
      { user: createdUsers[1]._id, score: 54100, rank: 4 },
      { user: createdUsers[3]._id, score: 41200, rank: 5 },
    ];
    await Leaderboard.insertMany(leaderboardData);
    console.log(`[Seed DB] Created ${leaderboardData.length} leaderboard entries.`);

    console.log('[Seed DB] Inserting Wishlist entries...');
    const wishlistData = [
      { user: createdUsers[0]._id, game: cs2Game._id },
      { user: createdUsers[0]._id, game: witcherGame._id },
    ];
    await Wishlist.insertMany(wishlistData);
    console.log(`[Seed DB] Created ${wishlistData.length} wishlist entries.`);

    console.log('[Seed DB] Inserting Posts & Comments...');
    const postsData = [
      {
        user: createdUsers[0]._id,
        authorName: createdUsers[0].username,
        authorAvatar: createdUsers[0].avatar,
        gameTitle: 'Black Myth: Wukong',
        title: 'Cấu hình tối ưu chơi Black Myth Wukong trên RTX 3060?',
        content: 'Anh em cho mình hỏi bật DLSS ở mức Quality thì FPS có ổn định 60fps khi chiến boss không nhỉ?',
        likesCount: 18,
        commentsCount: 5,
      },
      {
        user: createdUsers[1]._id,
        authorName: createdUsers[1].username,
        authorAvatar: createdUsers[1].avatar,
        gameTitle: 'Elden Ring',
        title: 'Review chân thực DLC Shadow of the Erdtree sau 30h cày game',
        content: 'Boss thiết kế cực căng nhưng độ đã thì miễn bàn! Đánh giá 9.5/10 cho anh em chuẩn bị vào game.',
        likesCount: 34,
        commentsCount: 12,
      },
      {
        user: createdUsers[2]._id,
        authorName: createdUsers[2].username,
        authorAvatar: createdUsers[2].avatar,
        gameTitle: 'Counter-Strike 2',
        title: 'Tìm 2 ông bắn CS2 kéo rank tối nay khu vực TP.HCM',
        content: 'Team hiện tại có 3 ông rank Mirage 14k+ điểm, cần tìm thêm tay súng uy tín bắn từ 9h tối.',
        likesCount: 9,
        commentsCount: 3,
      },
    ];
    const createdPosts = await Post.insertMany(postsData);
    console.log(`[Seed DB] Created ${createdPosts.length} posts.`);

    console.log('[Seed DB] Inserting Notifications...');
    const notificationsData = [
      {
        titleText: '🔥 Bão Sale Cuối Tuần PlayVerse',
        message: 'Giảm giá lên tới 60% cho toàn bộ các siêu phẩm thế giới mở Steam!',
        type: 'promotion',
        badge: 'SALE 60%',
      },
      {
        titleText: '🎮 Cập Nhật Hệ Thống PlayVerse v1.2',
        message: 'Tính năng Diễn Đàn & Thảo Luận Game chính thức đi vào hoạt động.',
        type: 'system',
        badge: 'MỚI',
      },
      {
        titleText: '🏆 Sự Kiện Đua Top Gamer Tuần 3',
        message: 'Tham gia bình luận và nhận ngay 500 P-Coins vào ví cá nhân.',
        type: 'event',
        badge: 'HOT',
      },
    ];
    await Notification.insertMany(notificationsData);
    console.log(`[Seed DB] Created ${notificationsData.length} notifications.`);

    console.log('==================================================');
    console.log('🎉 RE-SEEDING COMPLETED SUCCESSFULLY WITH POSTS & NOTIFICATIONS!');
    console.log('==================================================');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed DB Failed] ${error.message}`);
    process.exit(1);
  }
};

seedDB();
