const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { validateAdmin } = require('../middleware/validation');

// Routes
router.get('/dashboard/stats', auth, adminController.getDashboardStats);
router.get('/reports', auth, adminController.generateReport);
router.get('/admins', auth, adminController.getAllAdmins);
router.post('/admins', auth, validateAdmin, adminController.createAdmin);
router.put('/admins/:id', auth, adminController.updateAdmin);

module.exports = router;