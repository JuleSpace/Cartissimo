const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Priorité à DATABASE_URL si disponible (pour Railway)
if (process.env.DATABASE_URL) {
  console.log('🔧 Utilisation de DATABASE_URL pour la connexion');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: false // Railway MySQL n'utilise pas SSL
    }
  });
} else {
  console.log('🔧 Utilisation des variables DB individuelles');
  sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);
}

module.exports = sequelize; 