const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validateLogin } = require('../middleware/validation');

// Routes
router.post('/login', validateLogin, authController.login);
router.get('/me', auth, authController.getMe);
router.post('/logout', authController.logout);

module.exports = router;