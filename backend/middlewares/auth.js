const { verifyAccessToken } = require('../utils/jwtHelper');
const { unauthorizedResponse, forbiddenResponse } = require('../utils/responseHelper');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Middleware: Verifikasi JWT Access Token
 * Attach user ke req.user jika valid
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorizedResponse(res, 'Token autentikasi tidak ditemukan');
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return unauthorizedResponse(res, 'Token telah kadaluarsa, silakan login kembali');
      }
      return unauthorizedResponse(res, 'Token tidak valid');
    }

    // Cek user masih ada & aktif di DB
    const user = await User.findById(decoded.userId).select('-password -refreshToken');
    if (!user) {
      return unauthorizedResponse(res, 'Pengguna tidak ditemukan');
    }
    if (!user.isActive) {
      return unauthorizedResponse(res, 'Akun tidak aktif, hubungi administrator');
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    return unauthorizedResponse(res, 'Gagal memverifikasi token');
  }
};

/**
 * Middleware: Role-based Authorization
 * Gunakan setelah authenticate()
 * Contoh: authorize('admin') atau authorize('admin', 'user')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return unauthorizedResponse(res, 'Tidak terautentikasi');
    }
    if (!roles.includes(req.user.role)) {
      return forbiddenResponse(res, `Akses ditolak. Role yang dibutuhkan: ${roles.join(', ')}`);
    }
    next();
  };
};

/**
 * Middleware Opsional: Attach user jika token ada, tapi tidak wajib
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return next();

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select('-password -refreshToken');
    if (user && user.isActive) req.user = user;
  } catch (_) {
    // Token tidak valid, lanjut tanpa user
  }
  next();
};

module.exports = { authenticate, authorize, optionalAuth };
