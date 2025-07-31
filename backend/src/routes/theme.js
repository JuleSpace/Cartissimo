const express = require('express');
const router = express.Router();
const { controller: themeController, upload } = require('../controllers/themeController');
const { auth } = require('../middleware/auth');
const checkSubscription = require('../middleware/subscription');
const { controller: animationController } = require('../controllers/animationController');

// Route de test pour l'upload d'image (AVANT auth pour les tests)
router.post('/test-upload', upload, (req, res) => {
  console.log('🧪 Test upload:');
  console.log('   Body:', req.body);
  console.log('   File:', req.file);
  console.log('   Files:', req.files);
  
  if (req.file) {
    res.json({
      success: true,
      message: 'Fichier reçu',
      file: {
        originalname: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      }
    });
  } else {
    res.json({
      success: false,
      message: 'Aucun fichier reçu',
      body: req.body
    });
  }
});

router.use(auth);

router.post('/', upload, themeController.create);
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

// Routes pour la gestion de l'ordre des thèmes (admins uniquement)
router.get('/admin/themes-order', themeController.getThemesWithOrder);
router.post('/admin/update-order', themeController.updateThemeOrder);

// Route pour les parents avec déverrouillage progressif
router.get('/parent/themes', checkSubscription, themeController.getParentThemes);

module.exports = router; 