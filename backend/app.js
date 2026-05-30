const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

const app = express();

// ===========================
// SERVER CONFIGURATION
// ===========================
// Wajib diaktifkan saat deploy di platform cloud (Render/Vercel) agar IP asli terbaca
app.set('trust proxy', 1);

// ===========================
// SECURITY MIDDLEWARES
// ===========================

// Helmet: set security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // untuk serve static uploads
}));

// CORS
const corsOptions = {
  origin: (origin, callback) => {
    // Ambil URL dari .env jika ada, lalu gabungkan dengan URL lokal
    const envOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [];
    const allowedOrigins = [...envOrigins, 'http://localhost:3000', 'http://localhost:5173'];
    
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Rate Limiter - Global
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 menit
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: {
    status: 'error',
    message: 'Terlalu banyak permintaan, coba lagi dalam beberapa menit',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

// Rate Limiter - Auth (lebih ketat)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { status: 'error', message: 'Terlalu banyak percobaan login, coba lagi dalam 15 menit' },
});
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);

// ===========================
// GENERAL MIDDLEWARES
// ===========================

// HTTP Request Logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (msg) => logger.info(msg.trim()) },
  }));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files - untuk serve gambar yang diupload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===========================
// API ROUTES
// ===========================
app.use('/api/v1', routes);

// Root
app.get('/', (req, res) => {
  res.json({
    name: 'RiceCare AI - Backend API',
    description: 'REST API untuk deteksi penyakit daun padi berbasis AI',
    project: 'CC26-PSU169 | Coding Camp 2026 DBS Foundation',
    version: '1.0.0',
    docs: '/api/v1/health',
    endpoints: {
      auth: '/api/v1/auth',
      scans: '/api/v1/scans',
      diseases: '/api/v1/diseases',
      users: '/api/v1/users',
    },
  });
});

// ===========================
// ERROR HANDLERS (harus terakhir)
// ===========================
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
