const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  changePassword,
} = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

// ---- Validation Rules ----
const registerRules = [
  body('name').trim().notEmpty().withMessage('Nama wajib diisi').isLength({ min: 2, max: 100 }).withMessage('Nama 2-100 karakter'),
  body('email').isEmail().withMessage('Format email tidak valid').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
];

const loginRules = [
  body('email').isEmail().withMessage('Format email tidak valid').normalizeEmail(),
  body('password').notEmpty().withMessage('Password wajib diisi'),
];

const changePasswordRules = [
  body('oldPassword').notEmpty().withMessage('Password lama wajib diisi'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password baru minimal 6 karakter'),
];

// ---- Routes ----

/**
 * POST   /api/v1/auth/register        - Registrasi user baru
 * POST   /api/v1/auth/login           - Login & dapatkan token
 * POST   /api/v1/auth/refresh-token   - Perbarui access token
 * POST   /api/v1/auth/logout          - Logout (hapus refresh token)
 * GET    /api/v1/auth/me              - Profil user yang sedang login
 * PATCH  /api/v1/auth/change-password - Ubah password
 */
router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.patch('/change-password', authenticate, changePasswordRules, validate, changePassword);

module.exports = router;
