const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authController = {
  login: async (req, res) => {
    try {
      console.log('=== Début de la tentative de connexion ===');
      console.log('Headers reçus:', req.headers);
      console.log('Body reçu:', req.body);
      
      const { email, password } = req.body;
      console.log('Recherche de l\'utilisateur avec email:', email);
      
      const user = await User.findOne({ where: { email } });
      console.log('Utilisateur trouvé:', user ? 'Oui' : 'Non');

      if (!user || !user.validPassword(password)) {
        console.log('Échec de l\'authentification');
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      console.log('Authentification réussie pour:', email);

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
      });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Erreur détaillée:', error);
      res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
  },

  register: async (req, res) => {
    try {
      const { email, password, firstName, lastName, role } = req.body;
      
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }

      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        role: role || 'orthophonist'
      });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '24h'
      });

      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
  }
};

module.exports = authController; 