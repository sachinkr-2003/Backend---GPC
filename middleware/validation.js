const { body } = require('express-validator');

// Property request validation
exports.validatePropertyRequest = [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').isMobilePhone('en-IN').withMessage('Valid phone number is required'),
  body('propertyAddress').notEmpty().withMessage('Property address is required'),
  body('propertyType').isIn(['Residential', 'Commercial', 'Agricultural']).withMessage('Invalid property type'),
  body('serviceType').isIn(['Basic', 'Complete', 'Premium']).withMessage('Invalid service type')
];

// User validation
exports.validateUser = [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').isMobilePhone('en-IN').withMessage('Valid phone number is required'),
  body('email').optional().isEmail().withMessage('Valid email is required')
];

// Admin login validation
exports.validateLogin = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Admin creation validation
exports.validateAdmin = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['Admin', 'Super Admin', 'Manager']).withMessage('Invalid role')
];