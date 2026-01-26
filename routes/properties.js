const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const auth = require('../middleware/auth');
const { validatePropertyRequest } = require('../middleware/validation');

// Routes
router.get('/', auth, propertyController.getAllRequests);
router.post('/', validatePropertyRequest, propertyController.createRequest);
router.get('/:id', auth, propertyController.getRequest);
router.put('/:id', auth, propertyController.updateRequest);
router.delete('/:id', auth, propertyController.deleteRequest);

module.exports = router;