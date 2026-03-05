const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const auth = require('../middleware/auth');

// GET /api/settings - Public
router.get('/', getSettings);

// PUT /api/settings - Admin only
router.put('/', auth, updateSettings);

module.exports = router;
