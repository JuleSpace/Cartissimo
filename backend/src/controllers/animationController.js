const { Animation, Theme, UserTheme } = require('../models');
const multer = require('multer');
const path = require('path');

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const themeId = req.body.themeId;
    const themeType = themeId === '1' ? 'animaux' : 'vehicules';
    
    let folder = path.join('public');
    if (file.fieldname === 'animatedGif' || file.fieldname === 'realGif') {
      folder = path.join(folder, 'animations', themeType);
    } else if (file.fieldname === 'sound') {
      folder = path.join(folder, 'sounds', themeType);
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const animationController = {
  // Créer une nouvelle animation
  create: async (req, res) => {
    try {
      const { name, description, duration, width, height, themeId } = req.body;

      // Vérifier si l'utilisateur a accès au thème
      const userTheme = await UserTheme.findOne({
        where: {
          userId: req.user.id,
          themeId
        }
      });

      if (!userTheme) {
        return res.status(403).json({ error: 'Accès non autorisé au thème' });
      }

      const animation = await Animation.create({
        name,
        description,
        duration,
        width,
        height,
        themeId,
        createdBy: req.user.id,
        animatedGifPath: req.files.animatedGif[0].path,
        realGifPath: req.files.realGif[0].path,
        soundPath: req.files.sound[0].path
      });

      res.status(201).json(animation);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la création de l\'animation' });
    }
  },

  // Obtenir toutes les animations d'un thème
  getAllByTheme: async (req, res) => {
    try {
      console.log('Début de getAllByTheme');
      console.log('Params:', req.params);
      console.log('Query:', req.query);
      console.log('Body:', req.body);
      
      const themeId = parseInt(req.params.id);
      console.log('themeId après parsing:', themeId);
      
      if (isNaN(themeId)) {
        console.log('themeId invalide:', req.params.id);
        return res.status(400).json({ error: 'ID de thème invalide' });
      }

      console.log('userId:', req.user.id);

      // Vérifier si l'utilisateur a accès au thème
      console.log('Recherche de UserTheme...');
      const userTheme = await UserTheme.findOne({
        where: {
          userId: req.user.id,
          themeId: themeId
        }
      });
      console.log('UserTheme trouvé:', userTheme);

      if (!userTheme) {
        console.log('Accès non autorisé: UserTheme non trouvé');
        return res.status(403).json({ error: 'Accès non autorisé au thème' });
      }

      console.log('Recherche des animations...');
      const animations = await Animation.findAll({
        where: { themeId: themeId }
      });

      // Nettoyer les chemins des fichiers
      const cleanedAnimations = animations.map(animation => {
        const cleanedAnimation = animation.toJSON();
        cleanedAnimation.animatedGifPath = cleanedAnimation.animatedGifPath.replace(/^public\//, '');
        cleanedAnimation.realGifPath = cleanedAnimation.realGifPath.replace(/^public\//, '');
        cleanedAnimation.soundPath = cleanedAnimation.soundPath.replace(/^public\//, '');
        return cleanedAnimation;
      });

      console.log('Animations trouvées et nettoyées:', cleanedAnimations);
      res.json(cleanedAnimations);
    } catch (error) {
      console.error('Erreur détaillée dans getAllByTheme:', error);
      console.error('Stack trace:', error.stack);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des animations',
        details: error.message 
      });
    }
  },

  // Obtenir une animation spécifique
  getOne: async (req, res) => {
    try {
      const animation = await Animation.findByPk(req.params.id, {
        include: [{
          model: Theme,
          include: [{
            model: UserTheme,
            where: { userId: req.user.id },
            required: true
          }]
        }]
      });

      if (!animation) {
        return res.status(404).json({ error: 'Animation non trouvée' });
      }

      res.json(animation);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'animation' });
    }
  },

  // Mettre à jour une animation
  update: async (req, res) => {
    try {
      const animation = await Animation.findByPk(req.params.id, {
        include: [{
          model: Theme,
          include: [{
            model: UserTheme,
            where: { userId: req.user.id },
            required: true
          }]
        }]
      });

      if (!animation) {
        return res.status(404).json({ error: 'Animation non trouvée' });
      }

      await animation.update(req.body);
      res.json(animation);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'animation' });
    }
  },

  // Supprimer une animation
  delete: async (req, res) => {
    try {
      const animation = await Animation.findByPk(req.params.id, {
        include: [{
          model: Theme,
          include: [{
            model: UserTheme,
            where: { userId: req.user.id },
            required: true
          }]
        }]
      });

      if (!animation) {
        return res.status(404).json({ error: 'Animation non trouvée' });
      }

      await animation.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'animation' });
    }
  }
};

module.exports = {
  controller: animationController,
  upload
}; 