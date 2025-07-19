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
    
    // Lister le contenu du dossier dist pour debug
    const listDirectory = (dir, prefix = '') => {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        if (fs.statSync(itemPath).isDirectory()) {
          console.log(`📁 ${prefix}${item}/`);
          listDirectory(itemPath, prefix + '  ');
        } else {
          console.log(`📄 ${prefix}${item}`);
        }
      });
    };
    
    console.log('📁 Structure complète du dossier dist:');
    listDirectory(frontendPath);
    
    // Vérifier si index.html existe et afficher son contenu
    const indexPath = path.join(frontendPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('✅ index.html trouvé à:', indexPath);
      
      // Forcer la lecture fraîche du fichier (éviter le cache Node)
      delete require.cache[indexPath];
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      
      console.log('🔍 Taille du fichier index.html:', indexContent.length, 'caractères');
      console.log('🔍 Hash du contenu:', require('crypto').createHash('md5').update(indexContent).digest('hex').substring(0, 8));
      
      // Chercher les liens vers les fichiers JS/CSS
      const jsMatches = indexContent.match(/<script[^>]*src="[^"]*\.js"[^>]*>/g);
      const cssMatches = indexContent.match(/<link[^>]*href="[^"]*\.css"[^>]*>/g);
      console.log('📜 Scripts JS dans index.html:', jsMatches);
      console.log('🎨 CSS dans index.html:', cssMatches);
      
      // Comparer avec les fichiers physiques
      console.log('🔍 Comparaison avec les fichiers physiques:');
      const jsDir = path.join(frontendPath, 'js');
      if (fs.existsSync(jsDir)) {
        const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js') && !f.endsWith('.map'));
        console.log('📁 Fichiers JS physiques:', jsFiles);
        
        // Vérifier si les fichiers JS du HTML existent
        jsMatches?.forEach(match => {
          const srcMatch = match.match(/src="([^"]+)"/);
          if (srcMatch) {
            const jsFile = srcMatch[1];
            const physicalPath = path.join(frontendPath, jsFile.replace(/^\//, ''));
            console.log(`🔍 ${jsFile} → Existe: ${fs.existsSync(physicalPath) ? '✅' : '❌'}`);
          }
        });
      }
    } else {
      console.log('❌ index.html manquant !');
    }
    
    // Servir les fichiers statiques avec cache - AVANT le catch-all
    app.use(express.static(frontendPath, {
      maxAge: '1h',
      etag: false,
      index: false,  // Important : ne pas servir index.html automatiquement
      setHeaders: (res, filepath, stat) => {
        console.log('🎯 Express.static serving:', filepath);
        
        // Forcer le reload des fichiers critiques (pas de cache)
        if (filepath.includes('index.html') || filepath.includes('.js') || filepath.includes('.css')) {
          res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          });
        }
      }
    }));
    
    // Route catch-all pour les applications SPA - SEULEMENT pour les routes sans extension
    app.get('*', (req, res, next) => {
      // Laisser passer les routes API
      if (req.path.startsWith('/api/') || 
          req.path.startsWith('/public/') || 
          req.path.startsWith('/animations/') || 
          req.path.startsWith('/sounds/') || 
          req.path.startsWith('/images/')) {
        return next();
      }
      
      // Laisser passer tous les fichiers avec extension (js, css, png, etc.)
      const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(req.path);
      if (hasFileExtension) {
        console.log('📎 Fichier statique demandé:', req.path);
        
        // Vérifier si le fichier existe physiquement
        const filePath = path.join(frontendPath, req.path);
        if (fs.existsSync(filePath)) {
          console.log('✅ Fichier existe:', filePath);
          return next(); // Laisser express.static le gérer
        } else {
          console.log('❌ Fichier n\'existe pas:', filePath);
          return res.status(404).send('File not found');
        }
      }
      
      // Seulement pour les routes SPA (sans extension)
      console.log('📄 Serving SPA pour:', req.path);
      
      // Lire index.html à chaque requête (éviter le cache Docker)
      try {
        // Forcer la lecture fraîche du fichier
        const currentContent = fs.readFileSync(indexPath, 'utf8');
        const currentHash = require('crypto').createHash('md5').update(currentContent).digest('hex').substring(0, 8);
        console.log('🔄 Lecture fraîche index.html, hash:', currentHash);
        
        // Headers anti-cache pour forcer le reload navigateur
        res.set({
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        });
        res.send(currentContent);
      } catch (error) {
        console.error('❌ Erreur lecture index.html:', error);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
      }
    });
  } else {
    console.log('❌ Dossier frontend dist non trouvé à:', frontendPath);
    app.get('/', (req, res) => {
      res.json({ 
        message: 'Cartissimo API est en cours d\'exécution', 
        status: 'API active',
        note: 'Frontend non disponible - dossier dist manquant',
        path: frontendPath
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