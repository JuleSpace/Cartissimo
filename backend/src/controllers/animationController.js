const { Animation, Theme, UserTheme } = require('../models');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');
const fs = require('fs');

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const themeId = req.body.themeId;
    const themeType = req.body.themeType || 'default';
    const category = req.body.category || themeType;
    const baseDir = path.join(__dirname, '../../public');
    let uploadDir;

    if (file.fieldname === 'animatedGif' || file.fieldname === 'realGif') {
      uploadDir = path.join(baseDir, 'animations', category);
    } else if (file.fieldname === 'sound') {
      uploadDir = path.join(baseDir, 'sounds', category);
    } else {
      uploadDir = path.join(baseDir, 'uploads');
    }

    // Créer le répertoire s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Conserver le nom original du fichier
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    cb(null, `${baseName}-${uniqueSuffix}${extension}`);
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

  createAnimation: async (req, res) => {
    try {
      const { name, description, themeId, category } = req.body;
      const files = req.files;

      // Vérifier si l'utilisateur a accès au thème
      const userTheme = await UserTheme.findOne({
        where: {
          userId: req.user.id,
          themeId: themeId
        }
      });

      // Si l'utilisateur n'a pas accès via UserTheme, vérifier s'il est le créateur du thème
      if (!userTheme) {
        const theme = await Theme.findByPk(themeId);
        if (!theme || theme.createdBy !== req.user.id) {
          return res.status(403).json({ error: 'Accès non autorisé au thème' });
        }
      }

      // Récupérer le thème
      const theme = await Theme.findByPk(themeId);
      if (!theme) {
        return res.status(404).json({ error: 'Thème non trouvé' });
      }

      // Vérifier que tous les fichiers requis sont présents
      if (!files || !files.animatedGif || !files.realGif || !files.sound) {
        return res.status(400).json({ error: 'Tous les fichiers sont requis (GIF animé, GIF réel et son)' });
      }

      // Déterminer la catégorie (utiliser celle fournie ou extraire du nom du thème)
      let folderCategory = category;
      if (!folderCategory) {
        const themeName = theme.name.toLowerCase();
        if (themeName.includes('animal') || themeName.includes('animaux')) {
          folderCategory = 'animaux';
        } else if (themeName.includes('vehicule') || themeName.includes('véhicule')) {
          folderCategory = 'vehicules';
        } else if (themeName.includes('objet') || themeName.includes('objets')) {
          folderCategory = 'objets';
        } else if (themeName.includes('action') || themeName.includes('actions')) {
          folderCategory = 'actions';
        } else {
          folderCategory = 'default';
        }
      }

      // Générer les chemins des fichiers
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      
      // Chemins relatifs pour la base de données (sans le préfixe 'public/')
      const animatedGifPath = `/animations/${folderCategory}/${uniqueSuffix}-animated.gif`;
      const realGifPath = `/animations/${folderCategory}/${uniqueSuffix}-real.gif`;
      const soundPath = `/sounds/${folderCategory}/${uniqueSuffix}.mp3`;

      // Chemins complets pour le stockage des fichiers
      const animatedGifFullPath = path.join('public', animatedGifPath);
      const realGifFullPath = path.join('public', realGifPath);
      const soundFullPath = path.join('public', soundPath);

      // Créer les dossiers s'ils n'existent pas
      const animatedGifDir = path.dirname(animatedGifFullPath);
      const realGifDir = path.dirname(realGifFullPath);
      const soundDir = path.dirname(soundFullPath);

      if (!fs.existsSync(animatedGifDir)) {
        fs.mkdirSync(animatedGifDir, { recursive: true });
      }
      if (!fs.existsSync(realGifDir)) {
        fs.mkdirSync(realGifDir, { recursive: true });
      }
      if (!fs.existsSync(soundDir)) {
        fs.mkdirSync(soundDir, { recursive: true });
      }

      // Déplacer les fichiers vers les emplacements appropriés
      fs.renameSync(files.animatedGif[0].path, animatedGifFullPath);
      fs.renameSync(files.realGif[0].path, realGifFullPath);
      fs.renameSync(files.sound[0].path, soundFullPath);

      // Créer l'animation
      const animation = await Animation.create({
        name,
        description,
        themeId,
        createdBy: req.user.id,
        animatedGifPath,
        realGifPath,
        soundPath,
        status: 'pending',
        duration: 2000,
        width: 300,
        height: 300
      });

      res.status(201).json(animation);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erreur lors de la création de l\'animation',
        details: error.message 
      });
    }
  },

  // Obtenir toutes les animations d'un thème
  getAllByTheme: async (req, res) => {
    try {
      const themeId = parseInt(req.params.id);
      
      if (isNaN(themeId)) {
        return res.status(400).json({ error: 'ID de thème invalide' });
      }

      // Récupérer le thème avec ses animations
      const theme = await Theme.findByPk(themeId, {
        include: [{
          model: Animation,
          as: 'animations',
          attributes: ['id', 'name', 'description', 'animatedGifPath', 'realGifPath', 'soundPath', 'duration', 'width', 'height', 'status']
        }]
      });

      if (!theme) {
        return res.status(404).json({ error: 'Thème non trouvé' });
      }

      // Vérifier les permissions selon le rôle
      let hasAccess = false;
      
      if (req.user.role === 'admin') {
        // Les admins ont accès à tous les thèmes
        hasAccess = true;
      } else if (req.user.role === 'orthophonist') {
        // Les orthophonistes ont accès à leurs thèmes et aux thèmes approuvés
        hasAccess = theme.createdBy === req.user.id || theme.status === 'approved';
      } else {
        // Les parents ont accès aux thèmes auxquels ils sont liés
        const userTheme = await UserTheme.findOne({
          where: {
            userId: req.user.id,
            themeId: themeId
          }
        });
        hasAccess = !!userTheme;
      }

      if (!hasAccess) {
        return res.status(403).json({ error: 'Accès non autorisé au thème' });
      }

      // Nettoyer les chemins des fichiers
      const cleanedAnimations = theme.animations.map(animation => {
        const cleanedAnimation = animation.toJSON();
        cleanedAnimation.animatedGifPath = cleanedAnimation.animatedGifPath.replace(/^public\//, '');
        cleanedAnimation.realGifPath = cleanedAnimation.realGifPath.replace(/^public\//, '');
        cleanedAnimation.soundPath = cleanedAnimation.soundPath.replace(/^public\//, '');
        return cleanedAnimation;
      });

      res.json(cleanedAnimations);
    } catch (error) {
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
  },

  approveAnimation: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }

      const animation = await Animation.findByPk(req.params.id);
      if (!animation) {
        return res.status(404).json({ message: 'Animation non trouvée' });
      }

      animation.status = 'approved';
      await animation.save();

      res.json(animation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  rejectAnimation: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }

      const animation = await Animation.findByPk(req.params.id);
      if (!animation) {
        return res.status(404).json({ message: 'Animation non trouvée' });
      }

      animation.status = 'rejected';
      await animation.save();

      res.json(animation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir toutes les animations
  getAll: async (req, res) => {
    try {
      let animations;
      
      if (req.user.role === 'admin') {
        // Les admins voient toutes les animations
        animations = await Animation.findAll({
          include: [{
            model: Theme,
            as: 'theme',
            attributes: ['id', 'name', 'description', 'status']
          }]
        });
      } else if (req.user.role === 'orthophonist') {
        // Les orthophonistes voient leurs animations et les animations approuvées
        animations = await Animation.findAll({
          where: {
            [Op.or]: [
              { createdBy: req.user.id },
              { status: 'approved' }
            ]
          },
          include: [{
            model: Theme,
            as: 'theme',
            attributes: ['id', 'name', 'description', 'status']
          }]
        });
      } else {
        // Les parents voient uniquement les animations des thèmes auxquels ils sont liés
        animations = await Animation.findAll({
          include: [{
            model: Theme,
            as: 'theme',
            include: [{
              model: UserTheme,
              where: { userId: req.user.id },
              required: true
            }]
          }]
        });
      }

      // Nettoyer les chemins des fichiers
      const cleanedAnimations = animations.map(animation => {
        const cleanedAnimation = animation.toJSON();
        if (cleanedAnimation.animatedGifPath) {
          cleanedAnimation.animatedGifPath = cleanedAnimation.animatedGifPath.replace(/^public\//, '');
        }
        if (cleanedAnimation.realGifPath) {
          cleanedAnimation.realGifPath = cleanedAnimation.realGifPath.replace(/^public\//, '');
        }
        if (cleanedAnimation.soundPath) {
          cleanedAnimation.soundPath = cleanedAnimation.soundPath.replace(/^public\//, '');
        }
        return cleanedAnimation;
      });

      res.json(cleanedAnimations);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des animations',
        details: error.message 
      });
    }
  }
};

module.exports = {
  controller: animationController,
  upload
}; 