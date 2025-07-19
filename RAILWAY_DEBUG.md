# 🔧 Guide de dépannage Railway pour Cartissimo

## 🚨 Problèmes courants et solutions

### 1. Page blanche au chargement

**Cause :** Frontend non buildé ou variables d'environnement manquantes

**Solution :**
1. Vérifiez les logs Railway ("View logs")
2. Redéployez avec : `git commit --allow-empty -m "Redeploy" && git push`

### 2. Base de données vide

**Cause :** Service MySQL non configuré ou variables DB manquantes

**Solutions :**

#### A. Créer le service MySQL
1. Dans Railway : "New Service" → "Database" → "MySQL"
2. Attendez la création complète

#### B. Configurer les variables d'environnement
Dans l'onglet "Variables" de votre service principal, ajoutez :

```env
# OBLIGATOIRE - Configuration de base
NODE_ENV=production
PORT=$PORT

# OBLIGATOIRE - Base de données (copiez depuis votre service MySQL)
DB_HOST=containers-us-west-xxx.railway.app
DB_NAME=railway
DB_USER=root
DB_PASSWORD=[votre mot de passe MySQL]

# OBLIGATOIRE - Sécurité
JWT_SECRET=cartissimo-super-secret-jwt-key-2024-very-long-and-secure

# OPTIONNEL - Stripe (pour les paiements)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 3. Erreurs de connexion API

**Vérification :**
- Testez : `https://votre-app.railway.app/api/health`
- Devrait retourner : `{"status":"ok",...}`

**Si erreur 404/500 :**
1. Vérifiez les logs
2. Redéployez

## 📋 Checklist de déploiement

- [ ] Service MySQL créé dans Railway
- [ ] Variables d'environnement configurées (DB_HOST, DB_USER, DB_PASSWORD, JWT_SECRET)  
- [ ] Build command : `npm run build`
- [ ] Start command : `npm start`
- [ ] Code pushé sur GitHub
- [ ] Déploiement automatique déclenché

## 🔍 Commandes de diagnostic

### Vérifier l'API
```bash
curl https://votre-app.railway.app/api/health
```

### Vérifier la base de données (dans les logs)
Cherchez ces messages :
- ✅ "Connexion à la base de données établie"  
- ✅ "Base de données synchronisée"
- ✅ "Base de données initialisée avec succès"

## 🚀 Actions immédiates à faire

1. **Créer MySQL** : New Service → Database → MySQL
2. **Copier les variables DB** : Depuis l'onglet Variables du MySQL vers votre app
3. **Ajouter JWT_SECRET** : `cartissimo-super-secret-jwt-key-2024-very-long-and-secure`
4. **Redéployer** : Push un commit pour déclencher un nouveau déploiement
5. **Vérifier les logs** : "View logs" pour voir l'initialisation

## 💡 Comptes de test

Une fois la base initialisée, vous aurez ces comptes :

**Admin :**
- Email: `admin@cartissimo.com`
- Mot de passe: `Admin123!`

**Orthophoniste :**
- Email: `therapeute@cartissimo.com`
- Mot de passe: `Therapeute123!`

**Parent :**
- Email: `parent@cartissimo.com`
- Mot de passe: `Parent123!` 