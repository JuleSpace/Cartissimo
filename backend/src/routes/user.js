const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// Route d'inscription publique (ne nécessite pas d'authentification)
router.post('/register', userController.register);

// Route publique pour récupérer la liste des orthophonistes
router.get('/orthophonistes', userController.getOrthophonistes);

// Routes protégées (nécessitent une authentification)
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

// Routes pour la gestion des enfants
router.post('/children', auth, userController.addChild);
router.put('/children/:childId', auth, userController.updateChild);
router.delete('/children/:childId', auth, userController.deleteChild);

module.exports = router; 