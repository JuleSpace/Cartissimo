const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');
const { auth } = require('../middleware/auth');
const { controller: animationController } = require('../controllers/animationController');

router.use(auth);

router.post('/', themeController.create);
router.get('/', themeController.getAllThemes);
router.get('/:id', themeController.getOne);
router.put('/:id', themeController.update);
router.delete('/:id', themeController.delete);

// Routes pour l'approbation et le rejet des thèmes
router.post('/:themeId/approve', themeController.approveTheme);
router.post('/:themeId/reject', themeController.rejectTheme);

// Route pour obtenir les animations d'un thème
router.get('/:id/animations', (req, res, next) => {
  console.log('Route /:id/animations - Params:', req.params);
  next();
}, animationController.getAllByTheme);

router.post('/grant-access', themeController.grantAccess);
router.post('/revoke-access', themeController.revokeAccess);
router.get('/user/:userId', themeController.getUserThemes);

module.exports = router; 