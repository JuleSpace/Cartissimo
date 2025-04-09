const { Theme, UserTheme } = require('../models');

const themeController = {
  // Créer un nouveau thème
  create: async (req, res) => {
    try {
      const theme = await Theme.create({
        ...req.body,
        createdBy: req.user.id
      });

      // Associer le thème à l'utilisateur qui l'a créé
      await UserTheme.create({
        userId: req.user.id,
        themeId: theme.id
      });

      res.status(201).json(theme);
    } catch (error) {
      console.error('Erreur lors de la création du thème:', error);
      res.status(500).json({ error: 'Erreur lors de la création du thème' });
    }
  },

  // Obtenir tous les thèmes accessibles par l'utilisateur
  getAll: async (req, res) => {
    try {
      console.log('Tentative de récupération des thèmes pour l\'utilisateur:', req.user.id);
      
      const themes = await Theme.findAll({
        include: [{
          association: 'Users',
          where: { id: req.user.id },
          required: true
        }]
      });
      
      console.log('Thèmes trouvés:', themes);
      res.json(themes);
    } catch (error) {
      console.error('Erreur détaillée lors de la récupération des thèmes:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des thèmes',
        details: error.message 
      });
    }
  },

  // Obtenir un thème spécifique
  getOne: async (req, res) => {
    try {
      const theme = await Theme.findByPk(req.params.id, {
        include: [{
          association: 'userThemes',
          where: { userId: req.user.id },
          required: true
        }]
      });

      if (!theme) {
        return res.status(404).json({ error: 'Thème non trouvé ou accès non autorisé' });
      }

      res.json(theme);
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
      const theme = await Theme.findByPk(req.params.id);

      if (!theme) {
        return res.status(404).json({ error: 'Thème non trouvé' });
      }

      // Vérifier si l'utilisateur a accès au thème
      const userTheme = await UserTheme.findOne({
        where: {
          userId: req.user.id,
          themeId: theme.id
        }
      });

      if (!userTheme) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      await theme.update(req.body);
      res.json(theme);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour du thème' });
    }
  },

  // Supprimer un thème
  delete: async (req, res) => {
    try {
      const theme = await Theme.findByPk(req.params.id);

      if (!theme) {
        return res.status(404).json({ error: 'Thème non trouvé' });
      }

      // Vérifier si l'utilisateur a accès au thème
      const userTheme = await UserTheme.findOne({
        where: {
          userId: req.user.id,
          themeId: theme.id
        }
      });

      if (!userTheme) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      await theme.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression du thème' });
    }
  }
};

module.exports = themeController; 