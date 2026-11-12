// ── CRASH HANDLERS must be FIRST — before any require() ─────────────────────
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise);
  console.error('Reason:', reason);
  process.exit(1);
});

console.log('[1/10] Starting Yojana Sahayak backend...');

const express = require('express');
console.log('[2/10] express OK');

const cors = require('cors');
console.log('[3/10] cors OK');

const helmet = require('helmet');
console.log('[4/10] helmet OK');

const morgan = require('morgan');
console.log('[5/10] morgan OK');

const rateLimit = require('express-rate-limit');
console.log('[6/10] express-rate-limit OK');

require('dotenv').config();
console.log('[7/10] dotenv OK');

const connectDB = require('./config/db');
console.log('[8/10] db config OK');

const authRoutes = require('./routes/authRoutes');
console.log('[9a] authRoutes OK');

const schemeRoutes = require('./routes/schemeRoutes');
console.log('[9b] schemeRoutes OK');

const chatRoutes = require('./routes/chatRoutes');
console.log('[9c] chatRoutes OK');

const profileRoutes = require('./routes/profileRoutes');
console.log('[9d] profileRoutes OK');

const notificationRoutes = require('./routes/notificationRoutes');
console.log('[9e] notificationRoutes OK');

const { errorHandler } = require('./middleware/errorHandler');
console.log('[10/10] All modules loaded ✅');

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// CORS — allow all Vercel deployment URLs + localhost
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps, curl)
    if (!origin) return callback(null, true);
    // Allow any Vercel URL for this project (production + all preview deployments)
    if (origin.match(/^https:\/\/government-scheme-assistant.*\.vercel\.app$/)) {
      return callback(null, true);
    }
    // Also allow preview deployments under tanisha-bansals-projects account
    if (origin.match(/^https:\/\/.*tanisha-bansals-projects\.vercel\.app$/)) {
      return callback(null, true);
    }
    // Allow explicitly listed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Yojana Sahayak API is running', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'production'} mode`);
});

module.exports = app;
