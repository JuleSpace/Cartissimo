const { Theme, Animation, User, UserTheme, Patient, PatientTherapist } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const db = require('../models');

const themeController = {
  // Créer un nouveau thème
  create: async (req, res) => {
    try {
      console.log('=== Début de create ===');
      console.log('Body:', req.body);
      console.log('User:', req.user);
      
      const { name, description } = req.body;
      const theme = await Theme.create({
        name,
        description,
        status: 'pending',
        createdBy: req.user.id
      });
      
      console.log('Thème créé:', theme);
      
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
            ]
          });
        } else if (user.role === 'orthophonist') {
          console.log('Récupération des thèmes pour orthophoniste');
          themes = await Theme.findAll({
            where: {
              createdBy: user.id
            },
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
        } else {
          console.log('Récupération des thèmes pour parent');
          // Récupérer tous les patients du parent
          const patients = await Patient.findAll({
            where: { userId: user.id }
          });

          // Récupérer les thèmes associés à ces patients via une requête SQL
          const patientThemes = await db.sequelize.query(
            'SELECT DISTINCT t.* FROM themes t ' +
            'JOIN patient_themes pt ON t.id = pt.theme_id ' +
            'WHERE pt.patient_id IN (?)',
            {
              replacements: [patients.map(p => p.id)],
              type: db.sequelize.QueryTypes.SELECT
            }
          );

          // Récupérer les détails complets des thèmes
          themes = await Theme.findAll({
            where: {
              id: patientThemes.map(pt => pt.id)
            },
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

      // Vérifier si l'utilisateur est le créateur du thème
      if (theme.createdBy === req.user.id) {
        return res.json(theme);
      }

      // Pour les parents, vérifier si un de leurs enfants a accès au thème
      if (req.user.role === 'parent') {
        const patients = await Patient.findAll({
          where: { userId: req.user.id }
        });

        const hasAccess = await db.sequelize.query(
          'SELECT * FROM patient_themes WHERE theme_id = ? AND patient_id IN (?)',
          {
            replacements: [theme.id, patients.map(p => p.id)],
            type: db.sequelize.QueryTypes.SELECT
          }
        );

        if (hasAccess && hasAccess.length > 0) {
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

      // Vérifier les permissions
      if (req.user.role !== 'admin' && theme.createdBy !== req.user.id) {
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

      // Vérifier les permissions
      if (req.user.role !== 'admin' && theme.createdBy !== req.user.id) {
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
      const therapistId = req.user.id;

      // Vérifier que l'orthophoniste a accès au patient
      const hasAccess = await db.sequelize.query(
        'SELECT * FROM patient_therapists WHERE patient_id = ? AND therapist_id = ?',
        {
          replacements: [patientId, therapistId],
          type: db.sequelize.QueryTypes.SELECT
        }
      );

      if (!hasAccess || hasAccess.length === 0) {
        return res.status(403).json({
          success: false,
          message: "Vous n'avez pas accès à ce patient"
        });
      }

      // Vérifier que le thème appartient à l'orthophoniste
      const theme = await Theme.findOne({
        where: {
          id: themeId,
          createdBy: therapistId
        }
      });

      if (!theme) {
        return res.status(403).json({
          success: false,
          message: "Vous n'avez pas accès à ce thème"
        });
      }

      // Vérifier que le patient existe
      const patient = await Patient.findByPk(patientId);
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient non trouvé"
        });
      }

      // Créer l'association entre le patient et le thème via UserTheme
      await UserTheme.create({
        userId: patient.userId,
        themeId: themeId
      });

      res.json({
        success: true,
        message: "Accès accordé avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de l\'attribution de l\'accès:', error);
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
      const therapistId = req.user.id;

      // Vérifier que l'orthophoniste a accès au patient
      const hasAccess = await db.sequelize.query(
        'SELECT * FROM patient_therapists WHERE patient_id = ? AND therapist_id = ?',
        {
          replacements: [patientId, therapistId],
          type: db.sequelize.QueryTypes.SELECT
        }
      );

      if (!hasAccess || hasAccess.length === 0) {
        return res.status(403).json({
          success: false,
          message: "Vous n'avez pas accès à ce patient"
        });
      }

      // Vérifier que le thème appartient à l'orthophoniste
      const theme = await Theme.findOne({
        where: {
          id: themeId,
          createdBy: therapistId
        }
      });

      if (!theme) {
        return res.status(403).json({
          success: false,
          message: "Vous n'avez pas accès à ce thème"
        });
      }

      // Vérifier que le patient existe
      const patient = await Patient.findByPk(patientId);
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient non trouvé"
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
  }
};

module.exports = themeController; 