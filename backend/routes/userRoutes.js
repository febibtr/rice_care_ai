const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const { getProfile, updateProfile, getAllUsers, deactivateUser } = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const updateProfileRules = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Nama 2-100 karakter'),
  body('email').optional().isEmail().withMessage('Format email tidak valid').normalizeEmail(),
];

// Semua route butuh autentikasi
router.use(authenticate);

/**
 * GET    /api/v1/users/profile   - Profil user sendiri
 * PATCH  /api/v1/users/profile   - Update profil
 * GET    /api/v1/users           - Semua user (admin only)
 * DELETE /api/v1/users/:id       - Nonaktifkan user (admin only)
 */
router.get('/profile', getProfile);
router.patch('/profile', updateProfileRules, validate, updateProfile);
router.get('/', authorize('admin'), getAllUsers);
router.delete('/:id', authorize('admin'), deactivateUser);

module.exports = router;
