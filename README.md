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
git clone https://github.com/JuleSpace/Cartissimo.git
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
- Démarrer XAMPP ou équivalent (MySQL)
- Créer une bdd nommée Cartissimo
- La base devrait se remplir au lancement du backend via le batch.

4. **Préparer le backend** :
```bash
# Backend
cd backend
npm run prod
```
-Une fois terminé et le serveur lancé effectuer un Ctrl + C pour fermer le serveur.

## Importation des Données
```bash
# Backend
cd backend
node src/database/seed.js
```
E. **Installer pm2** :
cd ..
npm install pm2 -g


6. **Démarrer l'application** :
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

## Comptes

Administrateur :
Email : admin@cartissimo.com
Mot de passe : Admin123!

Thérapeute :
Email : therapeute@cartissimo.com
Mot de passe : Therapeute123!

Parent :
Email : parent@cartissimo.com
Mot de passe : Parent123!
