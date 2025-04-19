const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/auth');

// Routes protégées par authentification
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.put('/password', auth, userController.updatePassword);

// Routes admin uniquement
router.get('/', auth, isAdmin, userController.getAllUsers);
router.get('/:id', auth, isAdmin, userController.getUserById);
router.put('/:id', auth, isAdmin, userController.updateUser);
router.delete('/:id', auth, isAdmin, userController.deleteUser);

module.exports = router; 