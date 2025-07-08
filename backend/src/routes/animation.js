const express = require('express');
const router = express.Router();
const { controller: animationController, upload } = require('../controllers/animationController');
const { auth } = require('../middleware/auth');
const checkSubscription = require('../middleware/subscription');

// Routes protégées par authentification
router.use(auth);

// Routes pour les animations
router.get('/:themeId/animations', checkSubscription, animationController.getAllByTheme);
router.get('/:id', checkSubscription, animationController.getOne);
router.post('/', upload.fields([
  { name: 'animatedGif', maxCount: 1 },
  { name: 'realGif', maxCount: 1 },
  { name: 'sound', maxCount: 1 }
]), animationController.create);
router.post('/create', upload.fields([
  { name: 'animatedGif', maxCount: 1 },
  { name: 'realGif', maxCount: 1 },
  { name: 'sound', maxCount: 1 }
]), animationController.createAnimation);
router.put('/:id', animationController.update);
router.delete('/:id', animationController.delete);
router.post('/:id/approve', animationController.approveAnimation);
router.post('/:id/reject', animationController.rejectAnimation);
router.get('/', checkSubscription, animationController.getAll);

module.exports = router; 