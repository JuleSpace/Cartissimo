const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');
const { auth } = require('../middleware/auth');
const { controller: animationController } = require('../controllers/animationController');

router.use(auth);

router.post('/', themeController.create);
router.get('/', themeController.getAll);
router.get('/:id', themeController.getOne);
router.put('/:id', themeController.update);
router.delete('/:id', themeController.delete);

// Route pour obtenir les animations d'un thème
router.get('/:id/animations', (req, res, next) => {
  console.log('Route /:id/animations - Params:', req.params);
  next();
}, animationController.getAllByTheme);

module.exports = router; 