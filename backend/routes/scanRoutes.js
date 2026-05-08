const express = require('express');
const router = express.Router();

const {
  createScan,
  getMyScan,
  getScanById,
  deleteScan,
  getMyScanStats,
} = require('../controllers/scanController');
const { authenticate } = require('../middlewares/auth');
const upload = require('../config/multer');

// Semua route scan butuh autentikasi
router.use(authenticate);

/**
 * GET    /api/v1/scans/stats/summary  - Statistik scan user
 * GET    /api/v1/scans                - Riwayat scan (pagination + filter)
 * POST   /api/v1/scans                - Upload gambar & simpan hasil scan
 * GET    /api/v1/scans/:id            - Detail satu scan
 * DELETE /api/v1/scans/:id            - Hapus scan (soft delete)
 */
router.get('/stats/summary', getMyScanStats);
router.get('/', getMyScan);
router.post('/', upload.single('image'), createScan);
router.get('/:id', getScanById);
router.delete('/:id', deleteScan);

module.exports = router;
