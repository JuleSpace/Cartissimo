const { User } = require('../models');
const bcrypt = require('bcryptjs');

const userController = {
  // Obtenir le profil de l'utilisateur connecté
  getProfile: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Mettre à jour le profil de l'utilisateur connecté
  updateProfile: async (req, res) => {
    try {
      const { firstName, lastName, email } = req.body;
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      await user.update({
        firstName,
        lastName,
        email
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Mettre à jour le mot de passe de l'utilisateur connecté
  updatePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await user.update({ password: hashedPassword });
      res.json({ message: 'Mot de passe mis à jour avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir tous les utilisateurs (admin uniquement)
  getAllUsers: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }

      const users = await User.findAll({
        attributes: { exclude: ['password'] }
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir un utilisateur par ID (admin uniquement)
  getUserById: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }

      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Mettre à jour un utilisateur (admin uniquement)
  updateUser: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }

      const { firstName, lastName, email, role } = req.body;
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      await user.update({
        firstName,
        lastName,
        email,
        role
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Supprimer un utilisateur (admin uniquement)
  deleteUser: async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès non autorisé' });
      }

      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      await user.destroy();
      res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = userController; 