const express = require('express');
const router = express.Router();
const { getTestimonials, adminGetTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const auth = require('../middleware/auth');

router.get('/', getTestimonials);
router.get('/admin', auth, adminGetTestimonials);
router.post('/', auth, createTestimonial);
router.put('/:id', auth, updateTestimonial);
router.delete('/:id', auth, deleteTestimonial);

module.exports = router;
