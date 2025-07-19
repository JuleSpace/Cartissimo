# Configuration Railway pour Cartissimo

## Variables d'environnement à configurer dans Railway

Dans l'onglet "Variables" de votre service Railway, ajoutez :

### Configuration de base
```
NODE_ENV=production
PORT=$PORT
```

### Base de données (Railway MySQL)
```
DB_HOST=[Copiez MYSQL_HOST de votre service MySQL]
DB_NAME=[Copiez MYSQL_DATABASE de votre service MySQL]
DB_USER=[Copiez MYSQL_USER de votre service MySQL]
DB_PASSWORD=[Copiez MYSQL_PASSWORD de votre service MySQL]
```

### Authentification
```
JWT_SECRET=votre-cle-secrete-jwt-super-longue-et-complexe
```

### Stripe (Paiements)
```
STRIPE_SECRET_KEY=sk_live_votre_cle_stripe_secrete
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook
```

### Configuration réseau (optionnel)
```
HOST=0.0.0.0
IP=localhost
```

## Instructions de déploiement

1. **Créer le projet Railway** : Connectez votre repo GitHub
2. **Ajouter MySQL** : New Service → Database → MySQL
3. **Configurer les variables** : Copiez les variables ci-dessus dans l'onglet Variables
4. **Configurer les commandes** :
   - Build Command : `npm run build`
   - Start Command : `npm start`
5. **Déployer** : Push vers GitHub déclenche le déploiement automatique

## Notes importantes

- Railway sert automatiquement le frontend et le backend sur le même domaine
- Les fichiers statiques (animations, sons, images) sont servis par le backend
- Le frontend est automatiquement buildé et servi par Express en production
- Les déploiements se font automatiquement à chaque push sur la branche master 