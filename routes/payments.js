const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// Routes
router.post('/create-order', paymentController.createOrder);
router.post('/verify', paymentController.verifyPayment);
router.get('/', auth, paymentController.getAllPayments);
router.get('/:id', auth, paymentController.getPayment);

module.exports = router;