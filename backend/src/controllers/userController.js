const { User, Patient, Orthophoniste } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const userController = {
  // Inscription d'un nouveau parent avec ses enfants
  register: async (req, res) => {
    try {
      console.log('=== Début inscription ===');
      console.log('Body reçu:', req.body);

      const { 
        email, 
        password, 
        firstName, 
        lastName, 
        children,
        orthophonisteId 
      } = req.body;

      // Validation des données requises
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ 
          message: 'Email, mot de passe, prénom et nom sont requis' 
        });
      }

      if (!children || !Array.isArray(children) || children.length === 0) {
        return res.status(400).json({ 
          message: 'Au moins un enfant doit être renseigné' 
        });
      }

      // Vérifier si l'email existe déjà
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'Un compte avec cet email existe déjà' 
        });
      }

      // Vérifier que l'orthophoniste existe si spécifié
      if (orthophonisteId) {
        const ortho = await Orthophoniste.findByPk(orthophonisteId);
        if (!ortho) {
          return res.status(400).json({ 
            message: 'Orthophoniste non trouvé' 
          });
        }
      }

      // Créer l'utilisateur parent
      const user = await User.create({
        email,
        password, // Le hashage se fait automatiquement via le hook beforeCreate
        firstName,
        lastName,
        role: 'parent',
        subscriptionRequired: true
      });

      console.log('Utilisateur créé:', user.id);

      // Créer les enfants (patients)
      const createdChildren = [];
      for (const child of children) {
        const { firstName: childFirstName, lastName: childLastName, birthDate } = child;
        
        if (!childFirstName || !childLastName || !birthDate) {
          return res.status(400).json({ 
            message: 'Prénom, nom et date de naissance sont requis pour chaque enfant' 
          });
        }

        const patient = await Patient.create({
          firstName: childFirstName,
          lastName: childLastName,
          birthDate,
          parentEmail: email,
          userId: user.id,
          subscriptionStatus: 'inactive',
          orthophonisteId: orthophonisteId || null
        });

        createdChildren.push(patient);
        console.log('Enfant créé:', patient.id, childFirstName, childLastName);
      }

      // Générer un token JWT
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('=== Inscription réussie ===');

      res.status(201).json({
        message: 'Inscription réussie',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        children: createdChildren.map(child => ({
          id: child.id,
          firstName: child.firstName,
          lastName: child.lastName,
          birthDate: child.birthDate
        })),
        token
      });

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de l\'inscription' 
      });
    }
  },

  // Récupérer le profil utilisateur avec ses enfants
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      const user = await User.findByPk(userId, {
        include: [
          {
            model: Patient,
            as: 'patients',
            include: [
              {
                model: Orthophoniste,
                as: 'orthophoniste',
                attributes: ['id', 'firstName', 'lastName', 'email']
              }
            ]
          }
        ],
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          subscriptionRequired: user.subscriptionRequired
        },
        children: user.patients || []
      });

    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // Mettre à jour le profil utilisateur
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { firstName, lastName, email } = req.body;

      // Vérifier si l'email est déjà utilisé par un autre utilisateur
      if (email && email !== req.user.email) {
        const existingUser = await User.findOne({ 
          where: { 
            email,
            id: { [Op.ne]: userId }
          }
        });
        
        if (existingUser) {
          return res.status(400).json({ 
            message: 'Cet email est déjà utilisé par un autre compte' 
          });
        }
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Mettre à jour les champs fournis
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;

      await user.save();

      res.json({
        message: 'Profil mis à jour avec succès',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });

    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // Changer le mot de passe
  updatePassword: async (req, res) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          message: 'Mot de passe actuel et nouveau mot de passe sont requis' 
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ 
          message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' 
        });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Vérifier le mot de passe actuel
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ 
          message: 'Mot de passe actuel incorrect' 
        });
      }

      // Mettre à jour le mot de passe (le hook beforeUpdate se chargera du hachage)
      user.password = newPassword;
      await user.save();

      res.json({
        message: 'Mot de passe mis à jour avec succès'
      });

    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // Ajouter un enfant
  addChild: async (req, res) => {
    try {
      const userId = req.user.id;
      const { firstName, lastName, birthDate, orthophonisteId } = req.body;

      if (!firstName || !lastName || !birthDate) {
        return res.status(400).json({ 
          message: 'Prénom, nom et date de naissance sont requis' 
        });
      }

      // Vérifier que l'orthophoniste existe si spécifié
      if (orthophonisteId) {
        const ortho = await Orthophoniste.findByPk(orthophonisteId);
        if (!ortho) {
          return res.status(400).json({ 
            message: 'Orthophoniste non trouvé' 
          });
        }
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const patient = await Patient.create({
        firstName,
        lastName,
        birthDate,
        parentEmail: user.email,
        userId: userId,
        subscriptionStatus: 'inactive',
        orthophonisteId: orthophonisteId || null
      });

      res.status(201).json({
        message: 'Enfant ajouté avec succès',
        child: {
          id: patient.id,
          firstName: patient.firstName,
          lastName: patient.lastName,
          birthDate: patient.birthDate,
          orthophonisteId: patient.orthophonisteId
        }
      });

    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'enfant:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // Mettre à jour un enfant
  updateChild: async (req, res) => {
    try {
      const userId = req.user.id;
      const { childId } = req.params;
      const { firstName, lastName, birthDate, orthophonisteId } = req.body;

      // Vérifier que l'enfant appartient à l'utilisateur
      const patient = await Patient.findOne({
        where: { 
          id: childId,
          userId: userId 
        }
      });

      if (!patient) {
        return res.status(404).json({ 
          message: 'Enfant non trouvé ou accès non autorisé' 
        });
      }

      // Vérifier que l'orthophoniste existe si spécifié
      if (orthophonisteId) {
        const ortho = await Orthophoniste.findByPk(orthophonisteId);
        if (!ortho) {
          return res.status(400).json({ 
            message: 'Orthophoniste non trouvé' 
          });
        }
      }

      // Mettre à jour les champs fournis
      if (firstName) patient.firstName = firstName;
      if (lastName) patient.lastName = lastName;
      if (birthDate) patient.birthDate = birthDate;
      if (orthophonisteId !== undefined) patient.orthophonisteId = orthophonisteId;

      await patient.save();

      res.json({
        message: 'Enfant mis à jour avec succès',
        child: {
          id: patient.id,
          firstName: patient.firstName,
          lastName: patient.lastName,
          birthDate: patient.birthDate,
          orthophonisteId: patient.orthophonisteId
        }
      });

    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'enfant:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // Supprimer un enfant
  deleteChild: async (req, res) => {
    try {
      const userId = req.user.id;
      const { childId } = req.params;

      // Vérifier que l'enfant appartient à l'utilisateur
      const patient = await Patient.findOne({
        where: { 
          id: childId,
          userId: userId 
        }
      });

      if (!patient) {
        return res.status(404).json({ 
          message: 'Enfant non trouvé ou accès non autorisé' 
        });
      }

      await patient.destroy();

      res.json({
        message: 'Enfant supprimé avec succès'
      });

    } catch (error) {
      console.error('Erreur lors de la suppression de l\'enfant:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // Récupérer la liste des orthophonistes pour le formulaire d'inscription
  getOrthophonistes: async (req, res) => {
    try {
      const orthophonistes = await Orthophoniste.findAll({
        attributes: ['id', 'firstName', 'lastName', 'email', 'city'],
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
      });

      res.json(orthophonistes);

    } catch (error) {
      console.error('Erreur lors de la récupération des orthophonistes:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // ========== MÉTHODES ADMIN ==========

  /**
   * Récupérer la liste des parents (admin uniquement)
   */
  getParents: async (req, res) => {
    try {
      const parents = await User.findAll({
        where: { role: 'parent' },
        attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt'],
        include: [{
          model: Patient,
          as: 'patients',
          attributes: ['id', 'firstName', 'lastName', 'birthDate', 'subscriptionStatus', 'subscriptionEndDate', 'createdAt'],
          include: [{
            model: Orthophoniste,
            as: 'orthophoniste',
            attributes: ['id', 'firstName', 'lastName']
          }]
        }],
        order: [['lastName', 'ASC'], ['firstName', 'ASC']]
      });

      res.status(200).json(parents);
    } catch (error) {
      console.error('Erreur lors de la récupération des parents:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des parents',
        error: error.message 
      });
    }
  },

  /**
   * Récupérer les enfants d'un parent
   */
  getParentChildren: async (req, res) => {
    try {
      const { parentId } = req.params;

      const children = await Patient.findAll({
        where: { userId: parentId },
        attributes: ['id', 'firstName', 'lastName', 'birthDate', 'subscriptionStatus', 'subscriptionEndDate', 'createdAt'],
        include: [{
          model: Orthophoniste,
          as: 'orthophoniste',
          attributes: ['id', 'firstName', 'lastName']
        }],
        order: [['firstName', 'ASC']]
      });

      res.status(200).json(children);
    } catch (error) {
      console.error('Erreur lors de la récupération des enfants:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la récupération des enfants',
        error: error.message 
      });
    }
  },

  /**
   * Supprimer un parent (admin uniquement)
   */
  deleteParent: async (req, res) => {
    try {
      const { userId } = req.params;

      // Vérifier que l'utilisateur existe et est un parent
      const parent = await User.findOne({
        where: { id: userId, role: 'parent' }
      });

      if (!parent) {
        return res.status(404).json({ message: 'Parent non trouvé' });
      }

      // Supprimer d'abord tous les enfants du parent
      await Patient.destroy({
        where: { userId: userId }
      });

      // Puis supprimer le parent
      await User.destroy({
        where: { id: userId }
      });

      res.status(200).json({ message: 'Parent et ses enfants supprimés avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du parent:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la suppression du parent',
        error: error.message 
      });
    }
  },

  /**
   * Supprimer un enfant spécifique (admin uniquement)
   */
  deleteChildById: async (req, res) => {
    try {
      const { childId } = req.params;

      const child = await Patient.findByPk(childId);

      if (!child) {
        return res.status(404).json({ message: 'Enfant non trouvé' });
      }

      await Patient.destroy({
        where: { id: childId }
      });

      res.status(200).json({ message: 'Enfant supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'enfant:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la suppression de l\'enfant',
        error: error.message 
      });
    }
  }
};

module.exports = userController; 