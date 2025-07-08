const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');
const { auth } = require('../middleware/auth');
const checkSubscription = require('../middleware/subscription');
const { controller: animationController } = require('../controllers/animationController');

router.use(auth);

router.post('/', themeController.create);
router.get('/', checkSubscription, themeController.getAllThemes);
router.get('/:id', checkSubscription, themeController.getOne);
router.put('/:id', themeController.update);
router.delete('/:id', themeController.delete);

// Routes pour l'approbation et le rejet des thèmes
router.post('/:themeId/approve', themeController.approveTheme);
router.post('/:themeId/reject', themeController.rejectTheme);

// Route pour obtenir les animations d'un thème
router.get('/:id/animations', checkSubscription, (req, res, next) => {
  console.log('Route /:id/animations - Params:', req.params);
  next();
}, animationController.getAllByTheme);

router.post('/grant-access', themeController.grantAccess);
router.post('/revoke-access', themeController.revokeAccess);
router.get('/user/:userId', checkSubscription, themeController.getUserThemes);

module.exports = router; 