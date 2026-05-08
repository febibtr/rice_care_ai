const logger = require('../utils/logger');

/**
 * Global Error Handler Middleware
 * Harus dipasang TERAKHIR di app.js / server.js
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose: CastError (ID tidak valid)
  if (err.name === 'CastError') {
    message = `Resource dengan ID '${err.value}' tidak ditemukan`;
    statusCode = 404;
  }

  // Mongoose: Duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} sudah terdaftar`;
    statusCode = 409;
  }

  // Mongoose: Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(422).json({
      status: 'error',
      message: 'Validasi gagal',
      errors,
    });
  }

  // Multer: File too large
  if (err.code === 'LIMIT_FILE_SIZE') {
    message = `Ukuran file terlalu besar. Maksimal ${process.env.MAX_FILE_SIZE / 1024 / 1024}MB`;
    statusCode = 413;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Token tidak valid';
    statusCode = 401;
  }
  if (err.name === 'TokenExpiredError') {
    message = 'Token telah kadaluarsa';
    statusCode = 401;
  }

  // Log error jika server error (500)
  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} - ${message}`, { stack: err.stack });
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Handler untuk route yang tidak ditemukan (404)
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route '${req.originalUrl}' tidak ditemukan`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFoundHandler };
