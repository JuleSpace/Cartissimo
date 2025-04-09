# Cartissimo

Application d'aide aux enfants malentendants avec animations et sons.

## Structure du projet

- `backend/` : Serveur Node.js avec Express
- `frontend/` : Application Vue.js

## Prérequis

- Node.js (v14 ou supérieur)
- MySQL (via XAMPP)
- PM2 (pour le déploiement)

## Installation

1. **Cloner le dépôt** :
```bash
git clone [URL_DU_REPO]
cd cartissimo
```

2. **Installer les dépendances** :
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Configurer la base de données** :
- Démarrer XAMPP (MySQL)
- Créer une bdd nommée Cartissimo
- La base devrait se remplir au lancement du backend via le batch.

4. **Démarrer l'application** :
```bash
# Utiliser le script batch
start-cartissimo.bat
```

## Développement

- Backend : `http://localhost:3000`
- Frontend : `http://localhost:8080`

## Déploiement

L'application utilise PM2 pour le déploiement en production. Le script `start-cartissimo.bat` configure automatiquement :
- Le backend sur le port 3000
- Le frontend sur le port 8080
- Les variables d'environnement nécessaires

## Importation des Données
```bash
# Backend
cd backend
node src/database/seed.js
```
