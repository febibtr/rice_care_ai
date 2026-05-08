require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Scan = require('../models/Scan');
const Disease = require('../models/Disease');
const logger = require('../utils/logger');

// ─── Dummy Users ───────────────────────────────────────────────
const dummyUsers = [
  {
    name: 'Petani Demo',
    email: 'demo@ricecare.id',
    password: 'password123',
    role: 'user',
    scanCount: 12,
  },
  {
    name: 'Admin RiceCare',
    email: 'admin@ricecare.id',
    password: 'admin123456',
    role: 'admin',
    scanCount: 0,
  },
  {
    name: 'Budi Santoso',
    email: 'budi@petani.id',
    password: 'password123',
    role: 'user',
    scanCount: 8,
  },
];

// ─── Dummy Scans ───────────────────────────────────────────────
const dummyScans = (userId) => [
  {
    user: userId,
    imageUrl: '/uploads/dummy-blast-001.jpg',
    imageName: 'daun_padi_sawah.jpg',
    imageSize: 245760,
    diagnosis: 'blast',
    confidence: { sehat: 5, blast: 82, tungro: 8, brownspot: 5 },
    topConfidence: 82,
    aiNotes: 'Terdeteksi bercak berbentuk belah ketupat dengan tepi cokelat dan pusat abu-abu pada daun.',
    inferenceTimeMs: 1423,
    status: 'completed',
  },
  {
    user: userId,
    imageUrl: '/uploads/dummy-brownspot-001.jpg',
    imageName: 'foto_daun_padi_001.jpg',
    imageSize: 312400,
    diagnosis: 'brownspot',
    confidence: { sehat: 10, blast: 5, tungro: 8, brownspot: 77 },
    topConfidence: 77,
    aiNotes: 'Terdeteksi bercak oval cokelat dengan halo kuning, kemungkinan kekurangan kalium.',
    inferenceTimeMs: 1156,
    status: 'completed',
  },
  {
    user: userId,
    imageUrl: '/uploads/dummy-sehat-001.jpg',
    imageName: 'padi_sehat.jpg',
    imageSize: 198200,
    diagnosis: 'sehat',
    confidence: { sehat: 91, blast: 4, tungro: 3, brownspot: 2 },
    topConfidence: 91,
    aiNotes: 'Daun padi berwarna hijau merata, tidak ditemukan gejala penyakit.',
    inferenceTimeMs: 987,
    status: 'completed',
  },
  {
    user: userId,
    imageUrl: '/uploads/dummy-tungro-001.jpg',
    imageName: 'padi_sawah_foto.jpg',
    imageSize: 267100,
    diagnosis: 'tungro',
    confidence: { sehat: 6, blast: 10, tungro: 79, brownspot: 5 },
    topConfidence: 79,
    aiNotes: 'Daun menguning dari ujung ke pangkal, kemungkinan terinfeksi virus tungro.',
    inferenceTimeMs: 1344,
    status: 'completed',
  },
  {
    user: userId,
    imageUrl: '/uploads/dummy-blast-002.jpg',
    imageName: 'daun_blast_parah.jpg',
    imageSize: 289500,
    diagnosis: 'blast',
    confidence: { sehat: 3, blast: 89, tungro: 5, brownspot: 3 },
    topConfidence: 89,
    aiNotes: 'Serangan blast cukup parah, bercak menyebar luas di permukaan daun.',
    inferenceTimeMs: 1521,
    status: 'completed',
  },
  {
    user: userId,
    imageUrl: '/uploads/dummy-sehat-002.jpg',
    imageName: 'padi_bagus.jpg',
    imageSize: 178900,
    diagnosis: 'sehat',
    confidence: { sehat: 95, blast: 2, tungro: 2, brownspot: 1 },
    topConfidence: 95,
    aiNotes: 'Daun padi dalam kondisi prima, warna hijau pekat dan pertumbuhan baik.',
    inferenceTimeMs: 876,
    status: 'completed',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB connected for dummy data seeding...');

    // Hapus data lama
    await User.deleteMany({ email: { $in: dummyUsers.map((u) => u.email) } });
    await Scan.deleteMany({});
    logger.info('Existing dummy data cleared.');

    // Buat user dummy
    const createdUsers = [];
    for (const userData of dummyUsers) {
      const salt = await bcrypt.genSalt(12);
      const hashedPwd = await bcrypt.hash(userData.password, salt);
      const user = await User.create({ ...userData, password: hashedPwd });
      createdUsers.push(user);
      logger.info(`👤 User: ${user.email} (role: ${user.role})`);
    }

    // Buat scan dummy untuk user pertama (Petani Demo)
    const demoUser = createdUsers[0];
    const scans = dummyScans(demoUser._id);
    const createdScans = await Scan.insertMany(scans);
    logger.info(`\n🔬 ${createdScans.length} dummy scans created for ${demoUser.email}`);

    // Update scan count
    await User.findByIdAndUpdate(demoUser._id, { scanCount: createdScans.length });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    logger.error(`Dummy seeding failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

seed();
