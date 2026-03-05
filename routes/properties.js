const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const auth = require('../middleware/auth');
const { validatePropertyRequest } = require('../middleware/validation');
const { body, validationResult } = require('express-validator');

// Contact form validation
const validateContactForm = [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').matches(/^(?:\+91|91|0)?[6-9]\d{9}$/).withMessage('Valid mobile number is required'),
  body('propertyAddress').notEmpty().withMessage('Property address is required'),
  body('propertyType').isIn(['Residential', 'Commercial', 'Agricultural']).withMessage('Invalid property type'),
  body('serviceType').isIn(['Basic', 'Complete', 'Premium']).withMessage('Invalid service type')
];

// Routes
router.get('/', propertyController.getAllRequests); // Remove auth for viewing
router.post('/', validateContactForm, propertyController.createRequest);
router.get('/:id', auth, propertyController.getRequest);
router.put('/:id', auth, propertyController.updateRequest);
router.delete('/:id', auth, propertyController.deleteRequest);

module.exports = router;