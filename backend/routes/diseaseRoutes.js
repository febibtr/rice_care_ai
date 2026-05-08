const express = require('express');
const router = express.Router();

const {
  getAllDiseases,
  getDiseaseByKey,
  createDisease,
  updateDisease,
} = require('../controllers/diseaseController');
const { authenticate, authorize } = require('../middlewares/auth');

/**
 * GET    /api/v1/diseases         - Semua data penyakit (public)
 * GET    /api/v1/diseases/:key    - Detail penyakit by key (public)
 * POST   /api/v1/diseases         - Tambah penyakit (admin only)
 * PUT    /api/v1/diseases/:key    - Update penyakit (admin only)
 */
router.get('/', getAllDiseases);
router.get('/:key', getDiseaseByKey);
router.post('/', authenticate, authorize('admin'), createDisease);
router.put('/:key', authenticate, authorize('admin'), updateDisease);

module.exports = router;
