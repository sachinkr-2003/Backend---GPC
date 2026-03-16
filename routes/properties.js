const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { body, validationResult } = require('express-validator');

const validateContactForm = [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').matches(/^(?:\+91|91|0)?[6-9]\d{9}$/).withMessage('Valid mobile number is required'),
  body('propertyAddress').notEmpty().withMessage('Property address is required'),
  body('propertyType').isIn(['Residential', 'Commercial', 'Agricultural']).withMessage('Invalid property type'),
  body('serviceType').isIn(['Basic', 'Complete', 'Premium']).withMessage('Invalid service type')
];

router.get('/', auth, propertyController.getAllRequests);
router.post('/', upload.array('documents', 10), validateContactForm, propertyController.createRequest);
router.get('/:id', auth, propertyController.getRequest);
router.put('/:id', auth, propertyController.updateRequest);
router.put('/:id/assign', auth, propertyController.assignRequest);
router.delete('/:id', auth, propertyController.deleteRequest);

module.exports = router;
