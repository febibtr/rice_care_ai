const User = require('../models/User');
const Scan = require('../models/Scan');
const {
  successResponse,
  notFoundResponse,
  errorResponse,
} = require('../utils/responseHelper');

/**
 * @route   GET /api/v1/users/profile
 * @desc    Ambil profil lengkap user yang sedang login
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return notFoundResponse(res, 'User tidak ditemukan');
    return successResponse(res, { user: user.toPublicJSON() });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/v1/users/profile
 * @desc    Update profil user (nama, dll)
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'email'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (Object.keys(updates).length === 0) {
      return errorResponse(res, 'Tidak ada field yang valid untuk diperbarui', 400);
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, { user: user.toPublicJSON() }, 'Profil berhasil diperbarui');
  } catch (error) {
    if (error.code === 11000 && error.keyValue?.email) {
      return errorResponse(res, 'Email sudah digunakan', 400);
    }
    next(error);
  }
};

// ---- ADMIN ONLY ----

/**
 * @route   GET /api/v1/users
 * @desc    Ambil semua user (admin only, dengan pagination)
 * @access  Private - Admin
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      User.countDocuments(filter),
    ]);

    return successResponse(res, { users }, 'Data user berhasil diambil', 200, {
      page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Nonaktifkan user (soft delete, admin only)
 * @access  Private - Admin
 */
const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!user) return notFoundResponse(res, 'User tidak ditemukan');
    return successResponse(res, null, 'User berhasil dinonaktifkan');
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, getAllUsers, deactivateUser };
