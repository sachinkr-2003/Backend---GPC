const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { validateUser } = require('../middleware/validation');

// Routes
router.get('/', auth, userController.getAllUsers);
router.post('/', auth, validateUser, userController.createUser);
router.get('/:id', auth, userController.getUser);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;