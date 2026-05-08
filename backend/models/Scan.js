const mongoose = require('mongoose');

const confidenceSchema = new mongoose.Schema(
  {
    sehat: { type: Number, min: 0, max: 100 },
    blast: { type: Number, min: 0, max: 100 },
    tungro: { type: Number, min: 0, max: 100 },
    brownspot: { type: Number, min: 0, max: 100 },
  },
  { _id: false }
);

const scanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imageName: {
      type: String,
      required: true,
    },
    imageSize: {
      type: Number, // bytes
    },
    diagnosis: {
      type: String,
      enum: ['sehat', 'blast', 'tungro', 'brownspot'],
      required: true,
    },
    confidence: {
      type: confidenceSchema,
      required: true,
    },
    topConfidence: {
      type: Number, // confidence tertinggi (untuk sorting/filter)
      required: true,
    },
    aiNotes: {
      type: String, // catatan dari Claude AI
      default: null,
    },
    inferenceTimeMs: {
      type: Number, // waktu inferensi dalam milidetik
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
    isDeleted: {
      type: Boolean,
      default: false, // soft delete
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ---- Indexes ----
scanSchema.index({ user: 1, createdAt: -1 }); // query riwayat per user
scanSchema.index({ diagnosis: 1 });
scanSchema.index({ createdAt: -1 });
scanSchema.index({ isDeleted: 1 });

// ---- Virtual: label diagnosis ----
scanSchema.virtual('diagnosisLabel').get(function () {
  const labels = {
    sehat: 'Sehat',
    blast: 'Blast',
    tungro: 'Tungro',
    brownspot: 'Brown Spot',
  };
  return labels[this.diagnosis] || this.diagnosis;
});

// ---- Query helper: excludes soft-deleted ----
scanSchema.pre(/^find/, function (next) {
  if (!this.getOptions()._includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

module.exports = mongoose.model('Scan', scanSchema);
