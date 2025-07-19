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
const orthoRoutes = require('./routes/ortho');
const themeCompletionRoutes = require('./routes/themeCompletionRoutes');


// Chargement des variables d'environnement
dotenv.config();

const IP = process.env.IP || 'localhost';
const frontendOrigin = `http://${IP}:8080`;

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:8080',
  frontendOrigin,
  process.env.RAILWAY_STATIC_URL,
  'https://' + process.env.RAILWAY_STATIC_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Ajout d'un middleware pour logger les requêtes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  if (req.url.includes('/api/payments')) {
    console.log('=== Requête vers API payments ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
  }
  next();
});

// Middleware pour les webhooks Stripe (doit être avant express.json())
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint de santé pour Railway
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Cartissimo API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/animations', animationRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ortho', orthoRoutes);
app.use('/api/theme-completions', themeCompletionRoutes);

// Servir les fichiers statiques
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/animations', express.static(path.join(__dirname, '../public/animations')));
app.use('/sounds', express.static(path.join(__dirname, '../public/sounds')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Servir le frontend en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

// Synchronisation de la base de données
sequelize.sync()
  .then(() => {
    console.log('Base de données synchronisée');
  })
  .catch((err) => {
    console.error('Erreur de synchronisation de la base de données:', err);
  });

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Accessible sur http://localhost:${PORT}`);
  console.log(`Et sur http://${IP}:${PORT}`);
  console.log('Le serveur écoute sur toutes les interfaces réseau');
}); 