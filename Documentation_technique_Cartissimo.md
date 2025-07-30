# Documentation technique du site Cartissimo

## Table des matières
1. [Vue d'ensemble du projet](#vue-densemble-du-projet)
2. [Architecture technique](#architecture-technique)
3. [Fonctionnalités principales](#fonctionnalités-principales)
4. [Système de rôles et permissions](#système-de-rôles-et-permissions)
5. [Gestion des thèmes et animations](#gestion-des-thèmes-et-animations)
6. [Système d'abonnement](#système-dabonnement)
7. [Installation et déploiement](#installation-et-déploiement)
8. [Base de données](#base-de-données)
9. [API et endpoints](#api-et-endpoints)
10. [Sécurité](#sécurité)
11. [Maintenance et évolution](#maintenance-et-évolution)

## Vue d'ensemble du projet

### Objectif
Cartissimo est une application web éducative spécialement conçue pour aider les enfants malentendants dans leur apprentissage. Elle utilise des animations visuelles et des supports sonores pour créer une expérience d'apprentissage immersive et accessible.

### Public cible
- **Enfants malentendants** : Utilisateurs finaux de l'application
- **Parents** : Supervisent et paient les abonnements
- **Orthophonistes** : Professionnels qui encadrent et personnalisent l'expérience
- **Administrateurs** : Gestionnaires de la plateforme

### Valeur ajoutée
- **Accessibilité** : Interface adaptée aux enfants avec déficiences auditives
- **Progression structurée** : Système de déverrouillage progressif
- **Personnalisation** : Accès sur mesure via les orthophonistes
- **Qualité** : Contenu validé par des professionnels

## Architecture technique

### Stack technologique

#### Frontend
- **Framework** : Vue.js 3 avec Composition API
- **Routing** : Vue Router
- **État global** : Vuex
- **Styling** : CSS3 avec Flexbox/Grid
- **Build** : Webpack via Vue CLI
- **Paiement client** : @stripe/stripe-js
- **HTTP Client** : Axios

#### Backend
- **Runtime** : Node.js 18+
- **Framework** : Express.js
- **Base de données** : MySQL
- **ORM** : Sequelize
- **Authentification** : JWT (JSON Web Tokens)
- **Upload de fichiers** : Multer
- **Paiement** : Stripe
- **Sécurité** : bcryptjs, cors, helmet
- **Variables d'environnement** : dotenv

#### Infrastructure
- **Production** : Railway (PaaS)
- **Conteneurisation** : Docker (multi-stage build)
- **Base de données** : MySQL sur Railway
- **Stockage fichiers** : Express static
- **CI/CD** : GitHub → Railway (auto-deploy)
- **Monitoring** : Railway dashboard

### Architecture des dossiers

```
Code/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Logique métier
│   │   ├── models/          # Modèles de données
│   │   ├── routes/          # Définition des routes
│   │   ├── middleware/      # Middleware personnalisés
│   │   ├── config/          # Configuration
│   │   ├── database/        # Scripts DB
│   │   └── utils/           # Utilitaires (dbInit.js)
│   ├── public/              # Fichiers statiques
│   │   ├── animations/      # GIF d'animations par catégorie
│   │   ├── sounds/          # Fichiers audio MP3
│   │   ├── images/          # Images de thèmes, logos
│   │   └── uploads/         # Uploads utilisateurs (images thèmes)
│   ├── migrations/          # Scripts de migration
│   └── ecosystem.config.js  # Configuration PM2
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── views/           # Pages principales
│   │   ├── store/           # Gestion d'état Vuex
│   │   │   └── modules/     # Modules Vuex (auth, themes, etc.)
│   │   ├── router/          # Configuration routing
│   │   ├── composables/     # Composables Vue 3
│   │   └── assets/          # Ressources statiques
│   ├── public/              # Fichiers publics
│   │   ├── icons/           # Icônes PWA
│   │   └── manifest.json    # Manifest PWA
│   └── vue.config.js        # Configuration Vue CLI
├── docs/
│   └── diagrammes/          # Documentation technique
│       ├── MCD_Cartissimo.md
│       ├── DiagrammeClasses_Cartissimo.md
│       ├── CasUtilisation_Cartissimo.md
│       └── README_Diagrammes.md
├── Dockerfile               # Configuration Docker
├── railway.toml             # Configuration Railway
├── package.json             # Scripts de déploiement
└── start-cartissimo.bat     # Script de démarrage local
```

## Fonctionnalités principales

### 1. Système d'authentification
- **JWT** : Tokens sécurisés avec expiration 24h
- **Hashage** : Mots de passe avec bcrypt
- **Rôles** : Admin, orthophoniste, parent
- **Sessions** : Persistance locale via localStorage
- **Inscription publique** : Parents peuvent s'inscrire librement
- **Gestion de profil** : Modification des informations personnelles

### 2. Gestion des animations
- **Formats supportés** : GIF animés, GIF réels, MP3
- **Stockage** : Fichiers organisés par catégorie thématique
- **Streaming** : Lecture optimisée avec cache
- **Validation** : Contrôle qualité par les admins
- **Visualisation mobile** : Interface adaptée aux écrans tactiles

### 3. Interface utilisateur
- **Responsive** : Adaptation mobile et desktop optimisée
- **Accessibilité** : Contrastes élevés, gros boutons
- **Intuitive** : Navigation simplifiée pour enfants
- **Multimodale** : Visuel + audio synchronisé
- **PWA** : Application web progressive installable

### 4. Système de progression
- **Déverrouillage séquentiel** : Thèmes débloqués un par un
- **Suivi des progrès** : Base de données des complétions
- **Indicateurs visuels** : Pastilles d'ordre et de statut
- **Flexibilité** : Accès manuel via orthophonistes
- **Rapport de progression** : Suivi détaillé pour les professionnels

### 5. Gestion familiale
- **Multi-enfants** : Un parent peut gérer plusieurs enfants
- **Profils détaillés** : Informations personnelles et progression
- **Modification dynamique** : Ajout/suppression/modification d'enfants
- **Assignation orthophoniste** : Choix du professionnel lors de l'inscription

### 6. Création de contenu
- **Upload d'images** : Images personnalisées pour les thèmes
- **Validation workflow** : Soumission → Examen → Approbation/Rejet
- **Formats multiples** : Support JPG, PNG, GIF pour les images
- **Stockage sécurisé** : Dossier uploads dédié

### 7. Administration avancée
- **Gestion des parents** : CRUD complet avec vue sur les enfants
- **Supervision des abonnements** : Statuts et dates d'expiration
- **Gestion globale des thèmes** : Approbation, rejet, suppression
- **Accès thématique universel** : Attribution de thèmes à tout patient

## Système de rôles et permissions

### Administrateur (admin)
**Permissions complètes :**
- Gestion des utilisateurs (CRUD tous rôles)
- Validation des thèmes et animations (approuver/rejeter/supprimer)
- Configuration de l'ordre des thèmes
- Gestion des parents et de leurs enfants
- Supervision globale des abonnements
- Attribution d'accès thématique universel
- Suppression de contenus et d'utilisateurs

**Accès technique :**
- Tous les endpoints API
- Interface d'administration complète
- Logs et métriques système
- Configuration avancée

### Orthophoniste (orthophonist)
**Permissions métier :**
- Gestion de leurs patients assignés
- Création de thèmes avec upload d'images (soumis à validation)
- Création d'animations (soumises à validation)
- Attribution d'accès aux thèmes pour leurs patients
- Suivi des progrès de leurs patients
- Dashboard avec email des parents

**Restrictions :**
- Accès limité aux patients assignés uniquement
- Contenus soumis à validation admin obligatoire
- Pas d'accès aux données globales
- Pas de gestion des abonnements

### Parent (parent)
**Permissions étendues :**
- Consultation des thèmes débloqués pour ses enfants
- Visualisation des animations avec interface mobile
- Gestion complète de son profil (infos personnelles, mot de passe)
- Gestion de ses enfants (ajouter/modifier/supprimer)
- Gestion de son abonnement Stripe
- Suivi de progression de ses enfants
- Inscription autonome avec choix d'orthophoniste

**Restrictions :**
- Déverrouillage progressif strict (sauf accès manuel par orthophoniste)
- Abonnement requis pour certaines fonctionnalités premium
- Pas de création de contenu éducatif
- Accès limité à sa famille uniquement

## Gestion des thèmes et animations

### Structure des thèmes
```javascript
Theme {
  id: integer,
  name: string,
  description: text,
  image: string,              // Chemin vers l'image du thème
  order: integer,
  status: enum('pending', 'approved', 'rejected'),
  createdBy: integer,
  createdAt: datetime,
  updatedAt: datetime
}
```

### Structure des animations
```javascript
Animation {
  id: integer,
  name: string,
  description: text,
  themeId: integer,
  animatedGifPath: string,
  realGifPath: string,
  soundPath: string,
  duration: integer,
  width: integer,
  height: integer,
  status: enum('pending', 'approved', 'rejected'),
  createdBy: integer
}
```

### Workflow de validation
1. **Création** : Orthophoniste crée un thème
2. **Soumission** : Statut "pending"
3. **Validation** : Admin approuve/rejette
4. **Publication** : Statut "approved"
5. **Intégration** : Disponible pour les utilisateurs

### Système de fichiers
- **Animations** : `/public/animations/{category}/`
- **Sons** : `/public/sounds/{category}/`
- **Images** : `/public/images/themes/`
- **Formats** : GIF, MP3, JPG/PNG

## Système d'abonnement

### Intégration Stripe
- **Abonnement annuel** : Prix défini dans STRIPE_PRICE_ID
- **Paiement sécurisé** : PCI DSS compliant
- **Webhooks** : https://cartissimo.up.railway.app/api/payments/webhook
- **Gestion des échecs** : Retry automatique Stripe
- **Sessions de paiement** : Redirection dynamique selon l'environnement

### Statuts d'abonnement
- **active** : Accès complet aux thèmes premium
- **inactive** : Pas d'abonnement actif
- **expired** : Abonnement expiré, accès restreint
- **payment_failed** : Problème de paiement, à régulariser

### Logique d'accès mise à jour
```javascript
// Middleware de vérification d'abonnement
const checkSubscription = async (req, res, next) => {
  if (req.user.role !== 'parent') {
    return next(); // Admin et orthophonistes non concernés
  }

  const patients = await Patient.findAll({
    where: { userId: req.user.id }
  });
  
  const hasActiveSubscription = patients.some(patient => 
    patient.subscriptionStatus === 'active' && 
    new Date(patient.subscriptionEndDate) > new Date()
  );
  
  if (!hasActiveSubscription) {
    return res.status(403).json({ 
      error: 'subscription_required',
      message: 'Abonnement requis pour cette fonctionnalité'
    });
  }
  
  next();
};
```

### Configuration des webhooks
```javascript
// Validation de la signature Stripe
const sig = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  req.body, 
  sig, 
  process.env.STRIPE_WEBHOOK_SECRET
);

// Traitement des événements
switch (event.type) {
  case 'checkout.session.completed':
    await updateSubscriptionStatus(event.data.object);
    break;
  case 'invoice.payment_failed':
    await handlePaymentFailure(event.data.object);
    break;
}
```

## Installation et déploiement

### Prérequis
- Node.js v18+
- MySQL 8.0+
- Docker (pour production)
- Compte Railway
- Compte Stripe

### Installation développement local
```bash
# Cloner le repository
git clone https://github.com/JuleSpace/Cartissimo.git
cd cartissimo

# Installation des dépendances (automatique)
npm run postinstall

# Variables d'environnement
cp backend/.env.example backend/.env
# Configurer les variables d'environnement

# Base de données (automatique au démarrage)
# Le système initialise et seed automatiquement la DB

# Démarrage local
npm run dev
```

### Variables d'environnement

#### Développement (backend/.env)
```bash
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cartissimo
DB_USER=root
DB_PASSWORD=
JWT_SECRET=your-strong-jwt-secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
```

#### Production (Railway)
```bash
NODE_ENV=production
# PORT géré automatiquement par Railway
DATABASE_URL=mysql://user:pass@host:port/database
DB_HOST=gondola.proxy.rlwy.net
DB_PORT=30334  
DB_NAME=railway
DB_USER=root
DB_PASSWORD=generated-password
JWT_SECRET=production-jwt-secret
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_production...
STRIPE_PRICE_ID=price_production...
```

### Déploiement Railway

#### 1. Configuration initiale
```bash
# Connecter le repository GitHub à Railway
# Railway détecte automatiquement le Dockerfile

# Configuration railway.toml
[build]
builder = "DOCKERFILE"

[deploy]
startCommand = "node backend/src/index.js"
healthcheckPath = "/api/health"
```

#### 2. Base de données MySQL
```bash
# Ajouter service MySQL sur Railway
# Copier les variables de connexion
# L'application initialise automatiquement la DB au démarrage
```

#### 3. Variables Stripe
```bash
# Ajouter les clés Stripe dans Railway
# Configurer le webhook : https://cartissimo.up.railway.app/api/payments/webhook
# Tester avec l'endpoint /api/payments/webhook-test
```

#### 4. Déploiement automatique
```bash
# Push sur GitHub déclenche automatiquement le déploiement
git push origin main

# Surveillance des logs
railway logs --follow
```

### Architecture Docker (Multi-stage)
```dockerfile
# Build frontend séparément pour éviter les problèmes de cache
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/ ./
RUN npm ci && npm run build

# Setup backend
FROM node:18-alpine AS backend-setup  
WORKDIR /app/backend
COPY backend/ ./
RUN npm ci --only=production

# Production finale
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=backend-setup /app/backend ./backend/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist/
EXPOSE 8080
CMD ["node", "backend/src/index.js"]
```

## Base de données

### Modèle de données
```sql
-- Utilisateurs (avec nouveaux champs pour profil)
Users (
  id, email, password, firstName, lastName, role, 
  subscriptionRequired, phone, address, city, postalCode,
  createdAt, updatedAt
)

-- Patients (avec gestion d'abonnement par enfant)
Patients (
  id, firstName, lastName, birthDate, userId, 
  subscriptionStatus, subscriptionEndDate, orthophonisteId,
  createdAt, updatedAt
)

-- Thèmes (avec image personnalisée)
Themes (
  id, name, description, image, order, status, createdBy,
  createdAt, updatedAt
)

-- Animations (structure complète)
Animations (
  id, name, description, themeId, 
  animatedGifPath, realGifPath, soundPath, 
  duration, width, height, status, createdBy,
  createdAt, updatedAt
)

-- Accès utilisateur-thème (relation many-to-many)
UserThemes (userId, themeId, grantedBy, createdAt)

-- Complétion de thèmes (suivi progression)
ThemeCompletions (
  userId, themeId, completedAt, 
  completionTime, score
)

-- Orthophonistes (profil professionnel)
Orthophonistes (
  id, firstName, lastName, email, phone, 
  address, city, postalCode, specialties,
  isActive, createdAt, updatedAt
)

-- Relation patient-thérapeute (assignation)
PatientTherapists (
  patientId, therapistId, assignedAt,
  notes, isActive
)

-- Utilisateurs-Patients (relation parent-enfant)
UserPatients (userId, patientId, relationship, createdAt)
```

### Relations
- **Users** → **Patients** (1:N)
- **Users** ↔ **Themes** (N:M via UserThemes)
- **Themes** → **Animations** (1:N)
- **Users** → **ThemeCompletions** (1:N)
- **Patients** ↔ **Orthophonistes** (N:M via PatientTherapists)

### Indexation
- Index sur `themeId` (Animations)
- Index sur `userId` (UserThemes, Patients)
- Index sur `email` (Users, Orthophonistes)
- Index sur `status` (Themes, Animations)

## API et endpoints

### Authentification
```javascript
POST /api/auth/login           // Connexion utilisateur
POST /api/auth/register        // Inscription (admin/ortho uniquement)
GET  /api/auth/me             // Profil utilisateur connecté
```

### Utilisateurs et profils
```javascript
// Inscription publique parents
POST   /api/users/register           // Inscription parent avec enfants
GET    /api/users/orthophonistes     // Liste publique orthophonistes

// Gestion profil (authentifié)
GET    /api/users/profile            // Profil utilisateur avec enfants
PUT    /api/users/profile            // Modifier profil utilisateur
PUT    /api/users/password           // Changer mot de passe

// Gestion enfants par parent
POST   /api/users/children           // Ajouter un enfant
PUT    /api/users/children/:childId  // Modifier un enfant
DELETE /api/users/children/:childId  // Supprimer un enfant

// Administration utilisateurs (admin uniquement)
GET    /api/users/parents            // Liste des parents avec enfants
GET    /api/users/:parentId/children // Enfants d'un parent spécifique
DELETE /api/users/:userId            // Supprimer un utilisateur
DELETE /api/users/children/:childId  // Supprimer un enfant (admin)
```

### Thèmes
```javascript
// Consultation
GET    /api/themes                   // Liste des thèmes approuvés
GET    /api/themes/user/:userId      // Thèmes accessibles par utilisateur
GET    /api/themes/:id               // Détails d'un thème

// Création et modification (ortho/admin)
POST   /api/themes                   // Créer thème (avec upload image)
PUT    /api/themes/:id               // Modifier un thème
DELETE /api/themes/:id               // Supprimer un thème (admin)

// Workflow validation (admin)
POST   /api/themes/:id/approve       // Approuver un thème
POST   /api/themes/:id/reject        // Rejeter un thème
GET    /api/themes/admin/all         // Tous thèmes avec statistiques

// Gestion accès (ortho/admin)
POST   /api/themes/user/:userId      // Attribuer accès thème
DELETE /api/themes/user/:userId      // Révoquer accès thème
PUT    /api/themes/order             // Réorganiser ordre thèmes
```

### Animations
```javascript
GET    /api/themes/:id/animations    // Animations d'un thème
POST   /api/animations               // Créer une animation
GET    /api/animations/:id           // Détails d'une animation
PUT    /api/animations/:id           // Modifier une animation
DELETE /api/animations/:id           // Supprimer une animation
POST   /api/animations/:id/approve   // Approuver animation (admin)
POST   /api/animations/:id/reject    // Rejeter animation (admin)
```

### Patients et orthophonistes
```javascript
// Gestion patients (ortho)
GET    /api/patients                 // Patients de l'orthophoniste
GET    /api/patients/:id             // Détails patient
PUT    /api/patients/:id             // Modifier patient
POST   /api/patients/:id/assign-theme // Attribuer thème à patient

// Gestion orthophonistes (admin)
GET    /api/ortho                    // Liste orthophonistes
POST   /api/ortho                    // Créer orthophoniste
PUT    /api/ortho/:id                // Modifier orthophoniste
DELETE /api/ortho/:id                // Supprimer orthophoniste
```

### Paiements et abonnements
```javascript
// Gestion abonnement (parent)
POST   /api/payments/create-checkout-session  // Créer session Stripe
GET    /api/payments/subscription-status      // Statut abonnement

// Webhooks et admin
POST   /api/payments/webhook                  // Webhook Stripe
GET    /api/payments/webhook-test             // Test webhook (dev)
POST   /api/payments/simulate-activation      // Simulation (dev)

// Administration abonnements (admin)
GET    /api/payments/subscriptions/all        // Tous les abonnements
PUT    /api/payments/subscription/:patientId  // Modifier statut
```

### Progression et complétion
```javascript
// Suivi progression
GET    /api/progress/:patientId      // Progression d'un patient
POST   /api/themes/:id/complete      // Marquer thème complété
GET    /api/themes/:id/completions   // Historique complétion
```

### Système
```javascript
GET    /api/health                   // Health check Railway
GET    /api/version                  // Version application
```

## Sécurité

### Authentification
- **JWT** : Tokens signés avec secret
- **Expiration** : 24h par défaut
- **Refresh** : Ré-authentification requise
- **Stockage** : localStorage côté client

### Autorisation
- **Middleware** : Vérification systématique
- **Rôles** : Contrôle d'accès granulaire
- **Permissions** : Validation par endpoint
- **Audit** : Logs des actions sensibles

### Validation
- **Input** : Validation côté serveur
- **Sanitization** : Échappement des données
- **Upload** : Vérification des fichiers
- **SQL Injection** : Protection via ORM

### Paiements
- **Stripe** : PCI DSS compliant
- **Webhooks** : Vérification signature
- **Données sensibles** : Chiffrement
- **Logs** : Traçabilité des transactions

## Maintenance et évolution

### Monitoring

#### Production (Railway)
- **Health checks** : `/api/health` surveillé automatiquement  
- **Logs centralisés** : `railway logs` pour debugging
- **Métriques** : CPU, RAM, requêtes via Railway dashboard
- **Redémarrages automatiques** : En cas d'erreur ou crash
- **Alertes** : Notifications en cas de downtime

#### Développement local
- **Console logs** : Debugging temps réel
- **Nodemon** : Rechargement automatique en dev
- **Error tracking** : Stack traces détaillées

### Sauvegarde
- **Base de données** : Dump quotidien
- **Fichiers** : Synchronisation cloud
- **Configuration** : Versioning Git
- **Restauration** : Procédures documentées

### Évolutions récemment implémentées ✅
1. **Déploiement cloud** : Migration vers Railway avec Docker
2. **Gestion familiale complète** : Profils parents et enfants multiples
3. **Administration avancée** : Gestion des parents, supervision abonnements
4. **Upload de contenu** : Images personnalisées pour les thèmes
5. **Interface mobile optimisée** : UX améliorée pour écrans tactiles
6. **Inscription autonome** : Parents peuvent s'inscrire sans admin
7. **Documentation technique** : Diagrammes MCD, Classes, Cas d'usage

### Évolutions prévues 🚀
1. **Application mobile native** : React Native / Flutter
2. **Analytics avancées** : Tableaux de bord détaillés pour orthophonistes
3. **IA et recommandations** : Parcours personnalisés par IA
4. **Gamification** : Système de points et récompenses
5. **Mode hors ligne** : Synchronisation PWA
6. **API publique** : Intégration avec autres outils médicaux
7. **Notifications push** : Rappels et encouragements

### Optimisations
- **Caching** : Redis pour les sessions
- **CDN** : Distribution des médias
- **Compression** : Gzip/Brotli
- **Minification** : Assets optimisés

### Tests
- **Unitaires** : Jest pour Node.js
- **Intégration** : Supertest pour API
- **E2E** : Cypress pour frontend
- **Performance** : Artillery pour load testing

### Documentation
- **API** : Swagger/OpenAPI
- **Code** : JSDoc pour JavaScript
- **Utilisateur** : Guides intégrés
- **Technique** : Wiki interne

## État actuel du projet

### 🚀 Production
- **URL** : https://cartissimo.up.railway.app
- **Status** : ✅ Opérationnel  
- **Déploiement** : Automatique via GitHub
- **Base de données** : MySQL Railway (initialisée automatiquement)
- **Paiements** : Stripe configuré avec webhooks

### 📊 Fonctionnalités opérationnelles
- ✅ **Authentification complète** (3 rôles)
- ✅ **Inscription publique parents** avec enfants
- ✅ **Gestion profil familial** (CRUD enfants)
- ✅ **Création thèmes avec images** (workflow validation)
- ✅ **Interface mobile optimisée** (animations tactiles)  
- ✅ **Administration avancée** (parents, abonnements, thèmes)
- ✅ **Paiements Stripe** (abonnements annuels)
- ✅ **Dashboard orthophonistes** (patients avec emails parents)

### 📁 Documentation disponible
- ✅ **Documentation technique** (ce fichier)
- ✅ **Diagramme MCD** (`docs/diagrammes/MCD_Cartissimo.md`)
- ✅ **Diagramme de classes** (`docs/diagrammes/DiagrammeClasses_Cartissimo.md`)  
- ✅ **Cas d'utilisation** (`docs/diagrammes/CasUtilisation_Cartissimo.md`)
- ✅ **Guide des diagrammes** (`docs/diagrammes/README_Diagrammes.md`)

### 🔧 Architecture technique
- **Frontend** : Vue.js 3 + Vuex (SPA responsive)
- **Backend** : Node.js 18 + Express + Sequelize
- **Base de données** : MySQL 8.0 (Railway)
- **Déploiement** : Docker multi-stage sur Railway
- **CI/CD** : GitHub → Railway (auto-deploy)
- **Storage** : Fichiers statiques + uploads

### 📈 Métriques et performance
- **Temps de build** : ~2-3 minutes
- **Démarrage** : ~10-15 secondes
- **Base de données** : Initialisation automatique
- **Disponibilité** : 99.9% (Railway SLA)

---

*Documentation mise à jour le **19 janvier 2025** - Reflet de l'état actuel du projet Cartissimo en production.* 