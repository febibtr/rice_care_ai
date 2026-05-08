const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const scanRoutes = require('./scanRoutes');
const diseaseRoutes = require('./diseaseRoutes');
const userRoutes = require('./userRoutes');

// ---- Health Check ----
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'RiceCare AI API is running',
    version: 'v1',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

// ---- Mount Routes ----
router.use('/auth', authRoutes);
router.use('/scans', scanRoutes);
router.use('/diseases', diseaseRoutes);
router.use('/users', userRoutes);

module.exports = router;
