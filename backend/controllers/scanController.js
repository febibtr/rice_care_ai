const Scan = require('../models/Scan');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const {
  successResponse,
  createdResponse,
  errorResponse,
  notFoundResponse,
} = require('../utils/responseHelper');
const logger = require('../utils/logger');

/**
 * @route   POST /api/v1/scans
 * @desc    Upload gambar & simpan hasil deteksi AI
 * @access  Private
 */
const createScan = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'File gambar wajib diunggah', 400);
    }

    const { diagnosis, confidence, aiNotes, inferenceTimeMs } = req.body;

    // Validasi confidence adalah JSON valid
    let parsedConfidence;
    try {
      parsedConfidence = typeof confidence === 'string' ? JSON.parse(confidence) : confidence;
    } catch {
      return errorResponse(res, 'Format confidence tidak valid, harus JSON', 400);
    }

    // Validasi diagnosis valid
    const validDiagnoses = ['sehat', 'blast', 'tungro', 'brownspot'];
    if (!validDiagnoses.includes(diagnosis)) {
      return errorResponse(res, `Diagnosis tidak valid. Pilih dari: ${validDiagnoses.join(', ')}`, 400);
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const topConfidence = parsedConfidence[diagnosis] || 0;

    const scan = await Scan.create({
      user: req.user._id,
      imageUrl,
      imageName: req.file.originalname,
      imageSize: req.file.size,
      diagnosis,
      confidence: parsedConfidence,
      topConfidence,
      aiNotes: aiNotes || null,
      inferenceTimeMs: inferenceTimeMs ? parseInt(inferenceTimeMs) : null,
      status: 'completed',
    });

    // Increment scan count di user
    await User.findByIdAndUpdate(req.user._id, { $inc: { scanCount: 1 } });

    logger.info(`Scan created: ${scan._id} by user ${req.user._id} | diagnosis: ${diagnosis}`);

    return createdResponse(res, { scan }, 'Hasil scan berhasil disimpan');
  } catch (error) {
    // Hapus file yang sudah terupload jika gagal
    if (req.file) {
      const filePath = path.join(process.env.UPLOAD_PATH || './uploads', req.file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    next(error);
  }
};

/**
 * @route   GET /api/v1/scans
 * @desc    Ambil riwayat scan milik user yang login (dengan pagination & filter)
 * @access  Private
 */
const getMyScan = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      diagnosis,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter = { user: req.user._id };
    if (diagnosis && ['sehat', 'blast', 'tungro', 'brownspot'].includes(diagnosis)) {
      filter.diagnosis = diagnosis;
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const allowedSort = ['createdAt', 'topConfidence', 'diagnosis'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'createdAt';

    const [scans, total] = await Promise.all([
      Scan.find(filter)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Scan.countDocuments(filter),
    ]);

    return successResponse(
      res,
      { scans },
      'Data scan berhasil diambil',
      200,
      {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/v1/scans/:id
 * @desc    Ambil detail satu scan
 * @access  Private
 */
const getScanById = async (req, res, next) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id, user: req.user._id });
    if (!scan) return notFoundResponse(res, 'Data scan tidak ditemukan');

    return successResponse(res, { scan });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/v1/scans/:id
 * @desc    Soft delete scan
 * @access  Private
 */
const deleteScan = async (req, res, next) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id, user: req.user._id });
    if (!scan) return notFoundResponse(res, 'Data scan tidak ditemukan');

    scan.isDeleted = true;
    await scan.save();

    return successResponse(res, null, 'Data scan berhasil dihapus');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/v1/scans/stats/summary
 * @desc    Ringkasan statistik scan milik user
 * @access  Private
 */
const getMyScanStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalScans, diagnosisStats, recentScans] = await Promise.all([
      Scan.countDocuments({ user: userId }),
      Scan.aggregate([
        { $match: { user: userId, isDeleted: false } },
        { $group: { _id: '$diagnosis', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Scan.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    // Format diagnosis breakdown
    const breakdown = { sehat: 0, blast: 0, tungro: 0, brownspot: 0 };
    diagnosisStats.forEach((s) => { breakdown[s._id] = s.count; });

    return successResponse(res, {
      totalScans,
      breakdown,
      recentScans,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createScan, getMyScan, getScanById, deleteScan, getMyScanStats };
