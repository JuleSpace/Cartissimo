const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const path = require('path');

// Routes
const authRoutes = require('./routes/auth');
const themeRoutes = require('./routes/theme');
const animationRoutes = require('./routes/animation');
const patientRoutes = require('./routes/patient');
const paymentRoutes = require('./routes/payment');

// Chargement des variables d'environnement
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/animations', animationRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/payments', paymentRoutes);

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Synchronisation de la base de données
sequelize.sync()
  .then(() => {
    console.log('Base de données synchronisée');
  })
  .catch((err) => {
    console.error('Erreur de synchronisation de la base de données:', err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 