const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    console.log('Headers reçus:', req.headers);
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('Aucun token trouvé');
      throw new Error();
    }

    console.log('Token reçu:', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token décodé:', decoded);
    
    const user = await User.findByPk(decoded.id);

    if (!user) {
      console.log('Aucun utilisateur trouvé pour l\'ID:', decoded.id);
      throw new Error();
    }

    console.log('Utilisateur authentifié:', user.email);
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(401).send({ error: 'Veuillez vous authentifier.' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(403).send({ error: 'Accès non autorisé.' });
  }
};

module.exports = {
  auth,
  isAdmin
}; 