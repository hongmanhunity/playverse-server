const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/docs/swagger.json');
const connectDB = require('./src/config/db');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');
const { apiLimiter } = require('./src/middleware/rateLimitMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'PlayVerse API Service',
    version: '1.0.0',
    docs: '/api-docs',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/games', require('./src/routes/gameRoutes'));
app.use('/api/banners', require('./src/routes/bannerRoutes'));
app.use('/api/reviews', require('./src/routes/reviewRoutes'));
app.use('/api/leaderboards', require('./src/routes/leaderboardRoutes'));
app.use('/api/wishlist', require('./src/routes/wishlistRoutes'));
app.use('/api/posts', require('./src/routes/postRoutes'));
app.use('/api/notifications', require('./src/routes/notificationRoutes'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[PlayVerse API] Server listening on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Rejection]', err.message);
  server.close(() => process.exit(1));
});
