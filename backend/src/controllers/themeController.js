const { Theme, Animation, User, UserTheme, Patient, PatientTherapist, Orthophoniste } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('../models');

// Configuration Multer pour l'upload des images de thèmes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('🔧 Multer destination - file:', file.originalname);
    const uploadDir = path.join(__dirname, '../../public/images/themes');
    
    // Créer le répertoire s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      console.log('📁 Création du dossier:', uploadDir);
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    console.log('📁 Upload dir:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique
    const uniqueName = `theme_${Date.now()}_${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    console.log('📝 Nom de fichier généré:', uniqueName);
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  console.log('🔍 Multer fileFilter - mimetype:', file.mimetype);
  // Accepter seulement les images
  if (file.mimetype.startsWith('image/')) {
    console.log('✅ Fichier image accepté');
    cb(null, true);
  } else {
    console.log('❌ Fichier refusé, pas une image');
    cb(new Error('Seuls les fichiers image sont acceptés'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB
  }
});

const themeController = {
  // Créer un nouveau thème
  create: async (req, res) => {
    try {
      console.log('=== Début de create ===');
      console.log('Headers:', req.headers);
      console.log('Body:', req.body);
      console.log('Files:', req.files);
      console.log('File (single):', req.file);
      console.log('User:', req.user);
      
      const { name, description } = req.body;
      
      // Gérer l'image uploadée
      let imagePath = null;
      if (req.file) {
        // Stocker le chemin relatif pour la base de données
        imagePath = `/images/themes/${req.file.filename}`;
        console.log('🖼️ Image de thème uploadée:');
        console.log('   Nom fichier:', req.file.filename);
        console.log('   Chemin DB:', imagePath);
        console.log('   Chemin complet:', req.file.path);
      } else {
        console.log('❌ AUCUN FICHIER reçu!');
        console.log('   req.file:', req.file);
        console.log('   req.files:', req.files);
        console.log('   Content-Type:', req.headers['content-type']);
      }
      
      console.log('📝 Données à sauvegarder:');
      console.log('   Name:', name);
      console.log('   Description:', description);
      console.log('   Image path:', imagePath);
      console.log('   Status: pending');
      console.log('   Created by:', req.user.id);
      
      const theme = await Theme.create({
        name,
        description,
        image: imagePath,
        status: 'pending',
        createdBy: req.user.id
      });
      
      console.log('✅ Thème créé:', theme.toJSON());
      
      // Créer une entrée dans UserTheme pour lier le créateur au thème
      await UserTheme.create({
        userId: req.user.id,
        themeId: theme.id
      });
      
      console.log('Lien créateur-thème créé');
      
      // Si l'utilisateur n'est pas admin, créer une entrée pour l'admin
      if (req.user.role !== 'admin') {
        // Trouver l'administrateur
        const admin = await User.findOne({
          where: { role: 'admin' }
        });
        
        if (admin) {
          await UserTheme.create({
            userId: admin.id,
            themeId: theme.id
          });
          console.log('Lien admin-thème créé');
        } else {
          console.log('Aucun administrateur trouvé');
        }
      }
      
      console.log('=== Fin de create ===');
      res.status(201).json(theme);
    } catch (error) {
      console.error('Erreur lors de la création du thème:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir tous les thèmes accessibles par l'utilisateur
  getAllThemes: async (req, res) => {
    try {
      console.log('=== Début de getAllThemes ===');
      console.log('User:', {
        id: req.user.id,
        role: req.user.role,
        email: req.user.email
      });
      
      const user = req.user;
      let themes;

      try {
        if (user.role === 'admin') {
          console.log('Récupération des thèmes pour admin');
          themes = await Theme.findAll({
            include: [
              {
                model: User,
                as: 'creator',
                attributes: ['id', 'firstName', 'lastName', 'email']
              },
              {
                model: Animation,
                as: 'animations',
                attributes: ['id', 'name', 'description', 'animatedGifPath', 'realGifPath', 'soundPath', 'duration', 'width', 'height', 'status']
              }
            ],
            order: [['order', 'ASC'], ['createdAt', 'ASC']]
          });
        } else if (user.role === 'orthophonist') {
          console.log('Récupération des thèmes pour orthophoniste');
          // Les orthophonistes ont accès à tous les thèmes pour gérer l'accès de leurs patients
          themes = await Theme.findAll({
            include: [
              {
                model: User,
                as: 'creator',
                attributes: ['id', 'firstName', 'lastName', 'email']
              },
              {
                model: Animation,
                as: 'animations',
                attributes: ['id', 'name', 'description', 'animatedGifPath', 'realGifPath', 'soundPath', 'duration', 'width', 'height', 'status']
              }
            ],
            order: [['order', 'ASC'], ['createdAt', 'ASC']]
          });
        } else {
          console.log('Récupération des thèmes pour parent');
          // Récupérer les thèmes associés au parent via user_themes
          const userThemes = await UserTheme.findAll({
            where: { userId: user.id },
            include: [{
              model: Theme,
              as: 'theme',
              include: [
                {
                  model: User,
                  as: 'creator',
                  attributes: ['id', 'firstName', 'lastName', 'email']
                },
                {
                  model: Animation,
                  as: 'animations',
                  attributes: ['id', 'name', 'description', 'animatedGifPath', 'realGifPath', 'soundPath', 'duration', 'width', 'height', 'status']
                }
              ]
            }]
          });

          // Extraire les thèmes de la relation
          themes = userThemes.map(ut => ut.theme);
        }
      } catch (dbError) {
        console.error('Erreur lors de la requête à la base de données:', dbError);
        throw new Error(`Erreur de base de données: ${dbError.message}`);
      }

      console.log('Nombre de thèmes trouvés:', themes.length);

      // Convertir les objets Sequelize en JSON et nettoyer les chemins
      const themesJson = themes.map(theme => {
        try {
          const themeObj = theme.toJSON();
          if (themeObj.animations) {
            themeObj.animations = themeObj.animations.map(animation => {
              try {
                const animationObj = { ...animation };
                if (animationObj.animatedGifPath) {
                  animationObj.animatedGifPath = animationObj.animatedGifPath.replace('public/', '');
                }
                if (animationObj.realGifPath) {
                  animationObj.realGifPath = animationObj.realGifPath.replace('public/', '');
                }
                if (animationObj.soundPath) {
                  animationObj.soundPath = animationObj.soundPath.replace('public/', '');
                }
                return animationObj;
              } catch (err) {
                console.error('Erreur lors de la conversion d\'une animation:', err);
                return animation;
              }
            });
          }
          return themeObj;
        } catch (err) {
          console.error('Erreur lors de la conversion d\'un thème:', err);
          return theme;
        }
      });

      console.log('Nombre de thèmes convertis en JSON:', themesJson.length);
      console.log('=== Fin de getAllThemes ===');
      res.json(themesJson);
    } catch (error) {
      console.error('=== Erreur dans getAllThemes ===');
      console.error('Message d\'erreur:', error.message);
      console.error('Stack trace:', error.stack);
      console.error('=== Fin de l\'erreur ===');
      res.status(500).json({ 
        message: 'Erreur lors de la récupération des thèmes',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

  // Obtenir un thème spécifique
  getOne: async (req, res) => {
    try {
      const theme = await Theme.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: Animation,
            as: 'animations',
            attributes: ['id', 'name', 'description', 'animatedGifPath', 'realGifPath', 'soundPath', 'duration', 'width', 'height', 'status']
          }
        ]
      });

      if (!theme) {
        return res.status(404).json({ error: 'Thème non trouvé' });
      }

      // Les administrateurs ont accès à tous les thèmes
      if (req.user.role === 'admin') {
        return res.json(theme);
      }

      // Les orthophonistes ont accès à tous les thèmes pour gérer l'accès de leurs patients
      if (req.user.role === 'orthophonist') {
        return res.json(theme);
      }

      // Vérifier si l'utilisateur est le créateur du thème
      if (theme.createdBy === req.user.id) {
        return res.json(theme);
      }

      // Pour les parents, vérifier s'ils ont accès au thème via user_themes
      if (req.user.role === 'parent') {
        const hasAccess = await UserTheme.findOne({
          where: {
            userId: req.user.id,
            themeId: theme.id
          }
        });

        if (hasAccess) {
          return res.json(theme);
        }
      }

      return res.status(403).json({ error: 'Accès non autorisé au thème' });
    } catch (error) {
      console.error('Erreur détaillée lors de la récupération du thème:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération du thème',
        details: error.message 
      });
    }
  },

  // Mettre à jour un thème
  update: async (req, res) => {
    try {
      const { name, description, status } = req.body;
      const theme = await Theme.findByPk(req.params.id);

      if (!theme) {
        return res.status(404).json({ message: 'Thème non trouvé' });
      }

      // Vérifier les permissions - admins, créateurs, ou orthophonistes pour thèmes orphelins
      if (req.user.role !== 'admin' && theme.createdBy !== req.user.id && theme.createdBy !== null) {
        return res.status(403).json({ message: 'Non autorisé' });
      }

      await theme.update({
        name,
        description,
        status: req.user.role === 'admin' ? status : theme.status
      });

      res.json(theme);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Supprimer un thème
  delete: async (req, res) => {
    try {
      const theme = await Theme.findByPk(req.params.id);

      if (!theme) {
        return res.status(404).json({ message: 'Thème non trouvé' });
      }

      // Vérifier les permissions - admins, créateurs, ou orthophonistes pour thèmes orphelins
      if (req.user.role !== 'admin' && theme.createdBy !== req.user.id && theme.createdBy !== null) {
        return res.status(403).json({ message: 'Non autorisé' });
      }

      await theme.destroy();
      res.json({ message: 'Thème supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir les animations d'un thème
  getThemeAnimations: async (req, res) => {
    try {
      const theme = await Theme.findByPk(req.params.id, {
        include: [{
          model: Animation,
          as: 'animations',
          attributes: ['id', 'name', 'description', 'animatedGifPath', 'realGifPath', 'soundPath', 'duration', 'width', 'height', 'status']
        }]
      });

      if (!theme) {
        return res.status(404).json({ message: 'Thème non trouvé' });
      }

      // Convertir les objets Sequelize en JSON et nettoyer les chemins
      const themeObj = theme.toJSON();
      if (themeObj.animations) {
        themeObj.animations = themeObj.animations.map(animation => {
          const animationObj = animation;
          animationObj.animatedGifPath = animationObj.animatedGifPath.replace('public/', '');
          animationObj.realGifPath = animationObj.realGifPath.replace('public/', '');
          animationObj.soundPath = animationObj.soundPath.replace('public/', '');
          return animationObj;
        });
      }

      res.json(themeObj.animations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Approuver un thème
  approveTheme: async (req, res) => {
    try {
      const { themeId } = req.params;
      
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }

      const theme = await Theme.findByPk(themeId);
      if (!theme) {
        return res.status(404).json({ message: 'Thème non trouvé' });
      }

      theme.status = 'approved';
      await theme.save();

      res.json(theme);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Rejeter un thème
  rejectTheme: async (req, res) => {
    try {
      const { themeId } = req.params;
      
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }

      const theme = await Theme.findByPk(themeId);
      if (!theme) {
        return res.status(404).json({ message: 'Thème non trouvé' });
      }

      theme.status = 'rejected';
      await theme.save();

      res.json(theme);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  grantAccess: async (req, res) => {
    try {
      const { themeId, patientId } = req.body;
      const userEmail = req.user.email;

      console.log('=== DEBUG grantAccess ===');
      console.log('themeId:', themeId);
      console.log('patientId:', patientId);
      console.log('userEmail:', userEmail);

      // Récupérer l'orthophoniste correspondant à cet email
      const orthophoniste = await Orthophoniste.findOne({
        where: { email: userEmail }
      });

      console.log('Orthophoniste trouvé:', orthophoniste ? { id: orthophoniste.id, email: orthophoniste.email } : null);

      if (!orthophoniste) {
        return res.status(403).json({
          success: false,
          message: "Orthophoniste non trouvé"
        });
      }

      // Vérifier que l'orthophoniste a accès au patient
      const patient = await Patient.findOne({
        where: {
          id: patientId,
          orthophonisteId: orthophoniste.id
        }
      });

      console.log('Patient trouvé:', patient ? { id: patient.id, firstName: patient.firstName, userId: patient.userId } : null);

      if (!patient) {
        return res.status(403).json({
          success: false,
          message: "Vous n'avez pas accès à ce patient"
        });
      }

      // Vérifier que le thème existe (les orthophonistes ont accès à tous les thèmes)
      const theme = await Theme.findByPk(themeId);

      console.log('Thème trouvé:', theme ? { id: theme.id, name: theme.name } : null);

      if (!theme) {
        return res.status(404).json({
          success: false,
          message: "Thème non trouvé"
        });
      }

      console.log('Création de UserTheme avec userId:', patient.userId, 'themeId:', themeId);

      // Créer l'association entre le patient et le thème via UserTheme
      await UserTheme.create({
        userId: patient.userId,
        themeId: themeId
      });

      console.log('UserTheme créé avec succès');
      console.log('=== FIN DEBUG grantAccess ===');

      res.json({
        success: true,
        message: "Accès accordé avec succès"
      });
    } catch (error) {
      console.error('=== ERREUR grantAccess ===');
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      console.error('=== FIN ERREUR ===');
      res.status(500).json({
        success: false,
        message: "Erreur lors de l'attribution de l'accès",
        error: error.message
      });
    }
  },

  revokeAccess: async (req, res) => {
    try {
      const { themeId, patientId } = req.body;
      const userEmail = req.user.email;

      // Récupérer l'orthophoniste correspondant à cet email
      const orthophoniste = await Orthophoniste.findOne({
        where: { email: userEmail }
      });

      if (!orthophoniste) {
        return res.status(403).json({
          success: false,
          message: "Orthophoniste non trouvé"
        });
      }

      // Vérifier que l'orthophoniste a accès au patient
      const patient = await Patient.findOne({
        where: {
          id: patientId,
          orthophonisteId: orthophoniste.id
        }
      });

      if (!patient) {
        return res.status(403).json({
          success: false,
          message: "Vous n'avez pas accès à ce patient"
        });
      }

      // Vérifier que le thème existe (les orthophonistes ont accès à tous les thèmes)
      const theme = await Theme.findByPk(themeId);

      if (!theme) {
        return res.status(404).json({
          success: false,
          message: "Thème non trouvé"
        });
      }

      // Supprimer l'association entre le patient et le thème via UserTheme
      await UserTheme.destroy({
        where: {
          userId: patient.userId,
          themeId: themeId
        }
      });

      res.json({
        success: true,
        message: "Accès révoqué avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la révocation de l\'accès:', error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la révocation de l'accès",
        error: error.message
      });
    }
  },

  getUserThemes: async (req, res) => {
    try {
      const { userId } = req.params;
      const requestingUser = req.user;

      console.log('=== Début de getUserThemes ===');
      console.log('User ID:', userId);
      console.log('Requesting User:', requestingUser);

      // Vérifier les permissions
      if (requestingUser.role !== 'admin' && requestingUser.role !== 'orthophonist') {
        console.log('Accès non autorisé pour le rôle:', requestingUser.role);
        return res.status(403).json({
          success: false,
          message: "Accès non autorisé"
        });
      }

      // Si l'utilisateur est un orthophoniste, vérifier qu'il a accès au parent
      if (requestingUser.role === 'orthophonist') {
        const patient = await Patient.findOne({
          where: { userId }
        });

        if (!patient) {
          console.log('Parent non trouvé pour l\'ID:', userId);
          return res.status(404).json({
            success: false,
            message: "Parent non trouvé"
          });
        }

        // Vérifier l'accès via la table patient_therapists
        const hasAccess = await db.sequelize.query(
          'SELECT * FROM patient_therapists WHERE patient_id = ? AND therapist_id = ?',
          {
            replacements: [patient.id, requestingUser.id],
            type: db.sequelize.QueryTypes.SELECT
          }
        );

        if (!hasAccess || hasAccess.length === 0) {
          console.log('Pas d\'accès au parent pour l\'orthophoniste:', requestingUser.id);
          return res.status(403).json({
            success: false,
            message: "Vous n'avez pas accès à ce parent"
          });
        }
      }

      // Récupérer les thèmes de l'utilisateur
      const userThemes = await UserTheme.findAll({
        where: { userId },
        include: [{
          model: Theme,
          as: 'theme',
          include: [{
            model: Animation,
            as: 'animations',
            where: { status: 'approved' },
            required: false
          }]
        }]
      });

      console.log('Nombre de thèmes trouvés:', userThemes.length);

      // Formater la réponse
      const themes = userThemes.map(ut => ({
        id: ut.theme.id,
        name: ut.theme.name,
        description: ut.theme.description,
        status: ut.theme.status,
        animations: ut.theme.animations
      }));

      console.log('=== Fin de getUserThemes ===');
      res.json(themes);
    } catch (error) {
      console.error('Erreur lors de la récupération des thèmes:', error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des thèmes",
        error: error.message
      });
    }
  },

  // Méthode spécifique pour les orthophonistes - contourne le middleware checkSubscription
  getPatientThemesForOrtho: async (req, res) => {
    try {
      const { patientId } = req.params;
      const requestingUser = req.user;

      console.log('=== Début de getPatientThemesForOrtho ===');
      console.log('Patient ID:', patientId);
      console.log('Requesting User:', requestingUser);

      // Vérifier que l'utilisateur est un orthophoniste
      if (requestingUser.role !== 'orthophonist') {
        console.log('Accès non autorisé pour le rôle:', requestingUser.role);
        return res.status(403).json({
          success: false,
          message: "Accès non autorisé - rôle orthophoniste requis"
        });
      }

      // Vérifier que le patient existe et appartient à l'orthophoniste
      const patient = await Patient.findOne({
        where: { id: patientId }
      });

      if (!patient) {
        console.log('Patient non trouvé pour l\'ID:', patientId);
        return res.status(404).json({
          success: false,
          message: "Patient non trouvé"
        });
      }

      // Vérifier l'accès via la table patient_therapists
      const hasAccess = await db.sequelize.query(
        'SELECT * FROM patient_therapists WHERE patient_id = ? AND therapist_id = ?',
        {
          replacements: [patient.id, requestingUser.id],
          type: db.sequelize.QueryTypes.SELECT
        }
      );

      if (!hasAccess || hasAccess.length === 0) {
        console.log('Pas d\'accès au patient pour l\'orthophoniste:', requestingUser.id);
        return res.status(403).json({
          success: false,
          message: "Vous n'avez pas accès à ce patient"
        });
      }

      // Récupérer les thèmes accessibles par le parent du patient
      const userThemes = await UserTheme.findAll({
        where: { userId: patient.userId },
        include: [{
          model: Theme,
          as: 'theme',
          include: [{
            model: Animation,
            as: 'animations',
            where: { status: 'approved' },
            required: false
          }]
        }]
      });

      console.log('Nombre de thèmes trouvés pour le patient:', userThemes.length);

      // Formater la réponse
      const themes = userThemes.map(ut => ({
        id: ut.theme.id,
        name: ut.theme.name,
        description: ut.theme.description,
        status: ut.theme.status,
        animations: ut.theme.animations
      }));

      console.log('=== Fin de getPatientThemesForOrtho ===');
      res.json(themes);
    } catch (error) {
      console.error('Erreur lors de la récupération des thèmes pour orthophoniste:', error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des thèmes",
        error: error.message
      });
    }
  },

  // Méthode pour récupérer tous les thèmes avec leur ordre (pour les admins)
  getThemesWithOrder: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Accès non autorisé"
        });
      }

      const themes = await Theme.findAll({
        order: [['order', 'ASC'], ['createdAt', 'ASC']],
        attributes: ['id', 'name', 'description', 'order', 'status', 'createdAt']
      });

      res.json({
        success: true,
        themes
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des thèmes avec ordre:', error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des thèmes",
        error: error.message
      });
    }
  },

  // Méthode pour mettre à jour l'ordre des thèmes (pour les admins)
  updateThemeOrder: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: "Accès non autorisé"
        });
      }

      const { themeOrders } = req.body; // Array d'objets { id, order }

      if (!Array.isArray(themeOrders)) {
        return res.status(400).json({
          success: false,
          message: "Format invalide. Attendu: array d'objets { id, order }"
        });
      }

      // Mettre à jour l'ordre de chaque thème
      const promises = themeOrders.map(async (themeOrder) => {
        const { id, order } = themeOrder;
        return await Theme.update(
          { order: order },
          { where: { id: id } }
        );
      });

      await Promise.all(promises);

      res.json({
        success: true,
        message: "Ordre des thèmes mis à jour avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'ordre des thèmes:', error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour de l'ordre des thèmes",
        error: error.message
      });
    }
  },

  // Méthode pour gérer l'accès automatique des parents aux thèmes
  getParentThemes: async (req, res) => {
    try {
      const user = req.user;
      
      if (user.role !== 'parent') {
        return res.status(403).json({
          success: false,
          message: "Accès réservé aux parents"
        });
      }

      // Récupérer tous les thèmes ordonnés
      const allThemes = await Theme.findAll({
        where: { status: 'approved' },
        order: [['order', 'ASC'], ['createdAt', 'ASC']],
        include: [{
          model: Animation,
          as: 'animations',
          attributes: ['id', 'name', 'description', 'animatedGifPath', 'realGifPath', 'soundPath', 'duration', 'width', 'height', 'status']
        }]
      });

      // Récupérer les thèmes déjà complétés par l'utilisateur
      const { ThemeCompletion } = require('../models');
      const completedThemes = await ThemeCompletion.findAll({
        where: { userId: user.id },
        attributes: ['themeId']
      });

      const completedThemeIds = completedThemes.map(ct => ct.themeId);

      // Récupérer les thèmes auxquels l'utilisateur a déjà accès
      const userThemes = await UserTheme.findAll({
        where: { userId: user.id },
        attributes: ['themeId']
      });

      const accessibleThemeIds = userThemes.map(ut => ut.themeId);

      // Logique de déverrouillage progressif
      let availableThemes = [];
      
      for (let i = 0; i < allThemes.length; i++) {
        const theme = allThemes[i];
        
        // Les 2 premiers thèmes sont automatiquement disponibles
        if (i < 2) {
          availableThemes.push({
            ...theme.toJSON(),
            isUnlocked: true,
            isCompleted: completedThemeIds.includes(theme.id),
            unlockReason: 'Thème de base'
          });
          
          // S'assurer que l'utilisateur a accès à ces thèmes
          if (!accessibleThemeIds.includes(theme.id)) {
            await UserTheme.create({
              userId: user.id,
              themeId: theme.id
            });
          }
        } else {
          // Pour les thèmes suivants, vérifier si le thème précédent est complété
          const previousTheme = allThemes[i - 1];
          const isPreviousCompleted = completedThemeIds.includes(previousTheme.id);
          
          if (isPreviousCompleted) {
            availableThemes.push({
              ...theme.toJSON(),
              isUnlocked: true,
              isCompleted: completedThemeIds.includes(theme.id),
              unlockReason: `Débloqué après avoir complété "${previousTheme.name}"`
            });
            
            // S'assurer que l'utilisateur a accès à ce thème
            if (!accessibleThemeIds.includes(theme.id)) {
              await UserTheme.create({
                userId: user.id,
                themeId: theme.id
              });
            }
          } else {
            availableThemes.push({
              ...theme.toJSON(),
              isUnlocked: false,
              isCompleted: false,
              unlockReason: `Complétez "${previousTheme.name}" pour débloquer ce thème`
            });
          }
        }
      }

      res.json({
        success: true,
        themes: availableThemes
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des thèmes parent:', error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des thèmes",
        error: error.message
      });
    }
  }
};

module.exports = {
  controller: themeController,
  upload: upload.single('image')
}; 