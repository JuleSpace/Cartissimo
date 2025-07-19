const sequelize = require('../config/database');

const checkDatabaseConnection = async () => {
  console.log('🔄 Vérification de la connexion à la base de données...');
  console.log('🔧 Configuration DB:', {
    host: process.env.DB_HOST || 'non défini',
    database: process.env.DB_NAME || 'non défini',
    user: process.env.DB_USER || 'non défini',
    passwordSet: !!process.env.DB_PASSWORD
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:');
    console.error('Message:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.error('🚨 Problème : Host de base de données introuvable');
      console.error('   Vérifiez la variable DB_HOST dans Railway');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🚨 Problème : Connexion refusée');
      console.error('   Vérifiez que le service MySQL est démarré dans Railway');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🚨 Problème : Accès refusé');
      console.error('   Vérifiez DB_USER et DB_PASSWORD dans Railway');
    }
    
    return false;
  }
};

const initializeDatabase = async () => {
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    throw new Error('Impossible de se connecter à la base de données');
  }

  try {
    console.log('🔄 Synchronisation des modèles...');
    await sequelize.sync();
    console.log('✅ Modèles synchronisés');

    // Vérifier si des données existent
    const { User } = require('../models');
    const userCount = await User.count();
    console.log(`📊 Nombre d'utilisateurs existants: ${userCount}`);

    if (userCount === 0) {
      console.log('🌱 Base de données vide détectée - Initialisation avec données de base...');
      const seedDatabase = require('../database/seed');
      await seedDatabase();
      console.log('✅ Base de données initialisée avec succès!');
      
      // Vérifier que l'initialisation a fonctionné
      const newUserCount = await User.count();
      console.log(`📊 Nombre d'utilisateurs après initialisation: ${newUserCount}`);
      
      if (newUserCount > 0) {
        console.log('🎉 Données de test disponibles:');
        console.log('   👑 Admin: admin@cartissimo.com / Admin123!');
        console.log('   👩‍⚕️ Orthophoniste: therapeute@cartissimo.com / Therapeute123!');
        console.log('   👨‍👩‍👧‍👦 Parent: parent@cartissimo.com / Parent123!');
      }
    } else {
      console.log('✅ Base de données déjà initialisée');
    }

    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    throw error;
  }
};

module.exports = {
  checkDatabaseConnection,
  initializeDatabase
}; 