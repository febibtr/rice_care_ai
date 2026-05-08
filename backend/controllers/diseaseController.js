const Disease = require('../models/Disease');
const { successResponse, notFoundResponse } = require('../utils/responseHelper');

/**
 * @route   GET /api/v1/diseases
 * @desc    Ambil semua data penyakit
 * @access  Public
 */
const getAllDiseases = async (req, res, next) => {
  try {
    const diseases = await Disease.find({ isActive: true }).sort({ key: 1 }).lean();
    return successResponse(res, { diseases });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/v1/diseases/:key
 * @desc    Ambil detail penyakit berdasarkan key (sehat/blast/tungro/brownspot)
 * @access  Public
 */
const getDiseaseByKey = async (req, res, next) => {
  try {
    const disease = await Disease.findOne({ key: req.params.key, isActive: true });
    if (!disease) return notFoundResponse(res, 'Data penyakit tidak ditemukan');
    return successResponse(res, { disease });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/v1/diseases
 * @desc    Tambah data penyakit (admin only)
 * @access  Private - Admin
 */
const createDisease = async (req, res, next) => {
  try {
    const disease = await Disease.create(req.body);
    return res.status(201).json({ status: 'success', message: 'Data penyakit ditambahkan', data: { disease } });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/v1/diseases/:key
 * @desc    Update data penyakit (admin only)
 * @access  Private - Admin
 */
const updateDisease = async (req, res, next) => {
  try {
    const disease = await Disease.findOneAndUpdate(
      { key: req.params.key },
      req.body,
      { new: true, runValidators: true }
    );
    if (!disease) return notFoundResponse(res, 'Data penyakit tidak ditemukan');
    return successResponse(res, { disease }, 'Data penyakit diperbarui');
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllDiseases, getDiseaseByKey, createDisease, updateDisease };
