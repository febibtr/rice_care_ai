const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwtHelper');
const {
  successResponse,
  createdResponse,
  errorResponse,
  unauthorizedResponse,
} = require('../utils/responseHelper');
const logger = require('../utils/logger');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Registrasi user baru
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Cek email sudah ada
    const existing = await User.findOne({ email });
    if (existing) {
      return errorResponse(res, 'Email sudah terdaftar', 409);
    }

    const user = await User.create({ name, email, password });

    const payload = { userId: user._id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Simpan refresh token ke DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    logger.info(`New user registered: ${email}`);

    return createdResponse(res, {
      user: user.toPublicJSON(),
      accessToken,
      refreshToken,
    }, 'Registrasi berhasil');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login & dapatkan JWT token
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Ambil user termasuk password (select: false di schema)
    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user || !user.isActive) {
      return unauthorizedResponse(res, 'Email atau password salah');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return unauthorizedResponse(res, 'Email atau password salah');
    }

    const payload = { userId: user._id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    logger.info(`User logged in: ${email}`);

    return successResponse(res, {
      user: user.toPublicJSON(),
      accessToken,
      refreshToken,
    }, 'Login berhasil');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Perbarui access token menggunakan refresh token
 * @access  Public
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return unauthorizedResponse(res, 'Refresh token tidak ditemukan');
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      return unauthorizedResponse(res, 'Refresh token tidak valid atau telah kadaluarsa');
    }

    const user = await User.findById(decoded.userId).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      return unauthorizedResponse(res, 'Refresh token tidak valid');
    }

    const payload = { userId: user._id, role: user.role };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return successResponse(res, {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }, 'Token diperbarui');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout — hapus refresh token dari DB
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    logger.info(`User logged out: ${req.user.email}`);
    return successResponse(res, null, 'Logout berhasil');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/v1/auth/me
 * @desc    Dapatkan profil user yang sedang login
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return successResponse(res, { user: user.toPublicJSON() });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/v1/auth/change-password
 * @desc    Ubah password
 * @access  Private
 */
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return errorResponse(res, 'Password lama tidak sesuai', 400);
    }

    user.password = newPassword;
    await user.save();

    return successResponse(res, null, 'Password berhasil diubah');
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refreshToken, logout, getMe, changePassword };
