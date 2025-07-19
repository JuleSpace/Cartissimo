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

// Middleware CORS - Configuration étendue pour Railway
let allowedOrigins = [
  'http://localhost:8080',
  frontendOrigin
];

// Ajouter les domaines Railway si disponibles
if (process.env.RAILWAY_STATIC_URL) {
  allowedOrigins.push(`https://${process.env.RAILWAY_STATIC_URL}`);
  allowedOrigins.push(`http://${process.env.RAILWAY_STATIC_URL}`);
}

// En production, permettre toutes les origines du même domaine
if (process.env.NODE_ENV === 'production') {
  allowedOrigins.push(/railway\.app$/);
  allowedOrigins.push(/railway\.run$/);
}

console.log('🔧 CORS origins configurées:', allowedOrigins);

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
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  console.log('🎨 Chemin frontend:', frontendPath);
  
  // Vérifier si le dossier dist existe
  const fs = require('fs');
  if (fs.existsSync(frontendPath)) {
    console.log('✅ Dossier frontend dist trouvé');
    app.use(express.static(frontendPath));
    
    // Route catch-all pour les applications SPA
    app.get('*', (req, res) => {
      // Ne pas intercepter les routes API
      if (req.path.startsWith('/api/') || req.path.startsWith('/public/') || 
          req.path.startsWith('/animations/') || req.path.startsWith('/sounds/') || 
          req.path.startsWith('/images/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      }
      
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
  } else {
    console.log('❌ Dossier frontend dist non trouvé à:', frontendPath);
    app.get('/', (req, res) => {
      res.json({ 
        message: 'Cartissimo API est en cours d\'exécution', 
        status: 'API active',
        note: 'Frontend non disponible - dossier dist manquant'
      });
    });
  }
} else {
  // En développement, juste une route de base
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Cartissimo API - Mode développement',
      health: '/api/health',
      frontend: 'http://localhost:8080'
    });
  });
}

// Initialisation de la base de données avec l'utilitaire dédié
const { initializeDatabase } = require('./utils/dbInit');

// Démarrer l'initialisation
initializeDatabase()
  .then(() => {
    console.log('🚀 Base de données prête - Application opérationnelle');
  })
  .catch((error) => {
    console.error('💥 Échec de l\'initialisation de la base de données:', error.message);
    console.error('🛑 L\'application peut ne pas fonctionner correctement');
    // Ne pas arrêter l'application pour permettre le diagnostic
  });

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Accessible sur http://localhost:${PORT}`);
  console.log(`Et sur http://${IP}:${PORT}`);
  console.log('Le serveur écoute sur toutes les interfaces réseau');
}); 