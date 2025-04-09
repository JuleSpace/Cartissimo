const express = require('express');
const router = express.Router();
const { controller: animationController, upload } = require('../controllers/animationController');
const { auth } = require('../middleware/auth');

router.use(auth);

router.post('/', 
  upload.fields([
    { name: 'animatedGif', maxCount: 1 },
    { name: 'realGif', maxCount: 1 },
    { name: 'sound', maxCount: 1 }
  ]),
  animationController.create
);

router.get('/theme/:themeId', animationController.getAllByTheme);
router.get('/:id', animationController.getOne);
router.put('/:id', animationController.update);
router.delete('/:id', animationController.delete);

module.exports = router; 