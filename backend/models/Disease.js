const mongoose = require('mongoose');

/**
 * Model Disease - menyimpan informasi statis penyakit padi
 */
const diseaseSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: ['sehat', 'blast', 'tungro', 'brownspot'],
    },
    name: {
      type: String,
      required: true,
    },
    latinName: {
      type: String,
      default: null,
    },
    severity: {
      type: String,
      enum: ['none', 'low', 'medium', 'high'],
      default: 'none',
    },
    emoji: {
      type: String,
      default: '🌿',
    },
    description: {
      type: String,
      required: true,
    },
    symptoms: [{ type: String }],
    treatments: [{ type: String }],
    preventions: [{ type: String }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Disease', diseaseSchema);
