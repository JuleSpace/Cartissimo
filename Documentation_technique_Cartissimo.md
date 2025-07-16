# Documentation technique Cartissimo

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
- **Gestionnaire de process** : PM2

#### Backend
- **Runtime** : Node.js
- **Framework** : Express.js
- **Base de données** : MySQL
- **ORM** : Sequelize
- **Authentification** : JWT (JSON Web Tokens)
- **Upload de fichiers** : Multer
- **Paiement** : Stripe

#### Infrastructure
- **Serveur de développement** : Localhost
- **Serveur de fichiers** : Express static
- **Proxy** : Nginx (optionnel)
- **Process management** : PM2
- **Base de données** : MySQL via XAMPP

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
│   │   └── database/        # Scripts DB
│   ├── public/              # Fichiers statiques
│   │   ├── animations/      # GIF d'animations
│   │   ├── sounds/          # Fichiers audio
│   │   └── images/          # Images de thèmes
│   └── migrations/          # Scripts de migration
└── frontend/
    ├── src/
    │   ├── components/      # Composants réutilisables
    │   ├── views/           # Pages principales
    │   ├── store/           # Gestion d'état Vuex
    │   ├── router/          # Configuration routing
    │   └── assets/          # Ressources statiques
    └── public/              # Fichiers publics
```

## Fonctionnalités principales

### 1. Système d'authentification
- **JWT** : Tokens sécurisés avec expiration 24h
- **Hashage** : Mots de passe avec bcrypt
- **Rôles** : Admin, orthophoniste, parent
- **Sessions** : Persistance locale via localStorage

### 2. Gestion des animations
- **Formats supportés** : GIF animés, GIF réels, MP3
- **Stockage** : Fichiers organisés par thème
- **Streaming** : Lecture optimisée
- **Validation** : Contrôle qualité par les admins

### 3. Interface utilisateur
- **Responsive** : Adaptation mobile et desktop
- **Accessibilité** : Contrastes élevés, gros boutons
- **Intuitive** : Navigation simplifiée pour enfants
- **Multimodale** : Visuel + audio synchronisé

### 4. Système de progression
- **Déverrouillage séquentiel** : Thèmes débloqués un par un
- **Suivi des progrès** : Base de données des complétions
- **Indicateurs visuels** : Pastilles d'ordre et de statut
- **Flexibilité** : Accès manuel via orthophonistes

## Système de rôles et permissions

### Administrateur (admin)
**Permissions complètes :**
- Gestion des utilisateurs (CRUD)
- Validation des thèmes et animations
- Configuration de l'ordre des thèmes
- Accès à toutes les données
- Gestion des orthophonistes

**Accès technique :**
- Tous les endpoints API
- Interface d'administration
- Logs et métriques
- Configuration système

### Orthophoniste (orthophonist)
**Permissions métier :**
- Gestion de leurs patients
- Création de thèmes (soumis à validation)
- Accès manuel aux thèmes pour patients
- Suivi des progrès patients
- Dashboard personnalisé

**Restrictions :**
- Accès limité aux patients assignés
- Thèmes soumis à validation admin
- Pas d'accès aux données globales

### Parent (parent)
**Permissions limitées :**
- Consultation des thèmes débloqués
- Visualisation des animations
- Gestion de l'abonnement
- Suivi de progression enfant

**Restrictions :**
- Déverrouillage progressif strict
- Abonnement requis
- Pas de création de contenu
- Accès limité aux données

## Gestion des thèmes et animations

### Structure des thèmes
```javascript
Theme {
  id: integer,
  name: string,
  description: text,
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
- **Abonnement annuel** : 50€/an
- **Paiement sécurisé** : PCI DSS compliant
- **Webhooks** : Synchronisation automatique
- **Gestion des échecs** : Retry automatique

### Statuts d'abonnement
- **active** : Accès complet
- **inactive** : Pas d'abonnement
- **expired** : Abonnement expiré
- **payment_failed** : Problème de paiement

### Logique d'accès
```javascript
// Vérification d'abonnement
if (user.subscriptionRequired) {
  const patients = await Patient.findAll({
    where: { userId: user.id }
  });
  
  const hasActiveSubscription = patients.some(patient => 
    patient.subscriptionStatus === 'active' && 
    patient.subscriptionEndDate > new Date()
  );
  
  if (!hasActiveSubscription) {
    return res.status(403).json({ error: 'subscription_required' });
  }
}
```

## Installation et déploiement

### Prérequis
- Node.js v14+
- MySQL 5.7+
- XAMPP ou équivalent
- PM2 global

### Installation développement
```bash
# Cloner le repository
git clone https://github.com/JuleSpace/Cartissimo.git
cd cartissimo

# Backend
cd backend
npm install
cp .env.example .env
# Configurer les variables d'environnement

# Frontend
cd ../frontend
npm install

# Base de données
mysql -u root -p < backend/src/database/init.sql
node backend/src/database/seed.js
```

### Variables d'environnement
```bash
# Backend (.env)
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cartissimo
DB_USER=root
DB_PASSWORD=
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Déploiement production
```bash
# Installation PM2
npm install -g pm2

# Démarrage services
pm2 start ecosystem.config.js

# Monitoring
pm2 monit

# Logs
pm2 logs
```

## Base de données

### Modèle de données
```sql
-- Utilisateurs
Users (id, email, password, firstName, lastName, role, subscriptionRequired)

-- Patients
Patients (id, firstName, lastName, birthDate, userId, subscriptionStatus, subscriptionEndDate)

-- Thèmes
Themes (id, name, description, order, status, createdBy)

-- Animations
Animations (id, name, description, themeId, animatedGifPath, realGifPath, soundPath, duration, width, height, status, createdBy)

-- Accès utilisateur-thème
UserThemes (userId, themeId)

-- Complétion de thèmes
ThemeCompletions (userId, themeId)

-- Orthophonistes
Orthophonistes (id, firstName, lastName, email, phone, address, city, postalCode)

-- Relation patient-thérapeute
PatientTherapists (patientId, therapistId)
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
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
```

### Thèmes
```javascript
GET    /api/themes              // Liste des thèmes
POST   /api/themes              // Créer un thème
GET    /api/themes/:id          // Détails d'un thème
PUT    /api/themes/:id          // Modifier un thème
DELETE /api/themes/:id          // Supprimer un thème
POST   /api/themes/:id/approve  // Approuver un thème
POST   /api/themes/:id/reject   // Rejeter un thème
```

### Animations
```javascript
GET    /api/themes/:id/animations    // Animations d'un thème
POST   /api/animations              // Créer une animation
GET    /api/animations/:id          // Détails d'une animation
PUT    /api/animations/:id          // Modifier une animation
DELETE /api/animations/:id          // Supprimer une animation
```

### Utilisateurs
```javascript
GET    /api/users                   // Liste des utilisateurs
POST   /api/users                   // Créer un utilisateur
GET    /api/users/:id               // Détails d'un utilisateur
PUT    /api/users/:id               // Modifier un utilisateur
DELETE /api/users/:id               // Supprimer un utilisateur
```

### Paiements
```javascript
POST   /api/payments/create-checkout-session
GET    /api/payments/subscription-status
POST   /api/payments/webhook
POST   /api/payments/simulate-activation  // Dev uniquement
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
- **PM2** : Surveillance des processus
- **Logs** : Centralisation des erreurs
- **Performances** : Métriques applicatives
- **Santé** : Vérifications automatiques

### Sauvegarde
- **Base de données** : Dump quotidien
- **Fichiers** : Synchronisation cloud
- **Configuration** : Versioning Git
- **Restauration** : Procédures documentées

### Évolutions prévues
1. **Mobile** : Application React Native
2. **Analytics** : Tableaux de bord détaillés
3. **IA** : Recommandations personnalisées
4. **Gamification** : Système de récompenses
5. **Offline** : Mode hors ligne

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

---

*Cette documentation évolue avec le projet. Version mise à jour régulièrement par l'équipe de développement.* 