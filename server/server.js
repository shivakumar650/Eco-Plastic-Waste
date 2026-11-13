require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { createAdminUser } = require('./services/adminService');

// Import routes
const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaigns');
const resourceRoutes = require('./routes/resources');
const agencyRoutes = require('./routes/agencies');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS ||
  (process.env.NODE_ENV === 'production'
    ? ''
    : 'http://localhost:3000,http://localhost:5173'))
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
  throw new Error('CORS_ORIGINS must contain the deployed frontend origin in production');
}

if (process.env.NODE_ENV === 'production') {
  const requiredVariables = [
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'JWT_ACCESS_EXPIRE',
    'JWT_REFRESH_EXPIRE',
  ];
  const missingVariables = requiredVariables.filter((name) => !process.env[name]);

  if (missingVariables.length > 0) {
    throw new Error(`Missing production environment variables: ${missingVariables.join(', ')}`);
  }

  const jwtSecrets = [process.env.JWT_ACCESS_SECRET, process.env.JWT_REFRESH_SECRET];
  if (
    jwtSecrets.some((secret) => secret.length < 32 || /^replace_with_/i.test(secret)) ||
    jwtSecrets[0] === jwtSecrets[1]
  ) {
    throw new Error('Production JWT secrets must be unique, non-placeholder values of at least 32 characters');
  }
}

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Plastic Waste Portal API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/campaigns', campaignRoutes);
app.use('/api/v1/resources', resourceRoutes);
app.use('/api/v1/agencies', agencyRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await createAdminUser();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });

  process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
    server.close(() => process.exit(1));
  });

  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    process.exit(1);
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
}

module.exports = app;