# Configuration du système d'abonnement Stripe

## 1. Configuration Stripe

### Étape 1 : Créer un produit dans Stripe Dashboard
1. Connectez-vous à votre [Dashboard Stripe](https://dashboard.stripe.com)
2. Allez dans **Produits** > **Créer un produit**
3. Nom : "Abonnement Cartissimo"
4. Créez un prix récurrent :
   - Montant : 50,00 EUR
   - Intervalle : Annuel
   - Copiez l'ID du prix (commence par `price_`)

### Étape 2 : Configurer les webhooks
1. Allez dans **Développeurs** > **Webhooks**
2. Cliquez sur **Ajouter un endpoint**
3. URL : `https://votre-domaine.com/api/payment/webhook`
4. Événements à écouter :
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copiez le secret du webhook (commence par `whsec_`)

## 2. Variables d'environnement

### Backend (.env)
```env
# Stripe
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_stripe
STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_stripe
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook_stripe
STRIPE_PRICE_ID=price_votre_id_prix_stripe

# Frontend URL pour les redirections
FRONTEND_URL=http://localhost:8080

# Environnement
NODE_ENV=development
```

### Frontend (.env)
```env
VUE_APP_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_stripe
```

## 3. Installation des dépendances

### Backend
```bash
cd backend
npm install
# Stripe est déjà installé
```

### Frontend
```bash
cd frontend
npm install @stripe/stripe-js vue-toastification
```

## 4. Migration de la base de données

```bash
cd backend
node migrations/add-subscription-fields.js
```

## 5. Fonctionnement du système

### Pour les parents :
- `subscriptionRequired = true` dans la table `users`
- Vérification de l'abonnement via les champs `subscriptionStatus` et `subscriptionEndDate` dans la table `patients`
- Accès aux thèmes bloqué si l'abonnement n'est pas actif

### Pour les admin/orthophonistes :
- `subscriptionRequired = false` dans la table `users`
- Accès libre à toutes les fonctionnalités

### États d'abonnement :
- `active` : Abonnement actif
- `inactive` : Pas d'abonnement
- `expired` : Abonnement expiré
- `payment_failed` : Échec de paiement

## 6. Test du système

### Option A : Avec Stripe CLI (Recommandé)
1. Installez et configurez Stripe CLI
2. Lancez : `stripe listen --forward-to localhost:3000/api/payment/webhook`
3. Utilisez le secret temporaire dans votre .env
4. Testez le processus de paiement complet

### Option B : Avec simulation (Développement uniquement)
1. Créez un compte parent
2. Ajoutez un patient
3. Essayez d'accéder aux thèmes
4. Cliquez sur "Simuler l'abonnement (Dev)"
5. L'abonnement sera activé automatiquement

### Option C : Avec ngrok
1. Installez ngrok : `npm install -g ngrok`
2. Lancez : `ngrok http 3000`
3. Configurez l'URL ngrok dans Stripe Dashboard
4. Testez le processus de paiement complet

### Cartes de test Stripe :
- **Succès** : 4242 4242 4242 4242
- **Échec** : 4000 0000 0000 0002
- **Authentification 3D Secure** : 4000 0025 0000 3155

## 7. Déploiement en production

1. Remplacez les clés de test par les clés de production
2. Configurez l'URL du webhook en production
3. Mettez à jour `FRONTEND_URL` avec votre domaine de production
4. Testez le webhook avec l'outil de test Stripe

## 8. Surveillance

- Surveillez les logs des webhooks dans le Dashboard Stripe
- Vérifiez les erreurs de paiement
- Suivez les métriques d'abonnement

## 9. Support client

En cas de problème d'abonnement :
1. Vérifiez le statut dans Stripe Dashboard
2. Consultez les logs des webhooks
3. Mettez à jour manuellement le statut dans la base de données si nécessaire

## 10. Sécurité

- Les clés secrètes ne doivent jamais être exposées côté client
- Validez toujours les webhooks avec la signature
- Utilisez HTTPS en production
- Implémentez des logs d'audit pour les changements d'abonnement 

## **Option 1 : Utiliser Stripe CLI (Recommandé)**

### Installation
```bash
# Windows
winget install stripe/stripe-cli

# macOS
brew install stripe/stripe-cli/stripe

# Linux
curl -s https://packages.stripe.com/api/v1/bintray/stripe-cli-releases/stripe-cli-linux-x64-latest.tar.gz | tar -xz
```

### Configuration
```bash
# Se connecter à Stripe
stripe login

# Écouter les webhooks et les rediriger vers ton serveur local
stripe listen --forward-to localhost:3000/api/payment/webhook
```

Cette commande va :
- Créer un endpoint webhook temporaire
- Te donner un secret webhook temporaire (commence par `whsec_`)
- Rediriger tous les événements vers ton serveur local

### Mise à jour du .env
```env
# Utilise le secret temporaire fourni par Stripe CLI
STRIPE_WEBHOOK_SECRET=whsec_le_secret_temporaire_fourni_par_stripe_cli
```

## **Option 2 : Utiliser ngrok**

### Installation
```bash
# Télécharge ngrok depuis https://ngrok.com/
# Ou avec npm
npm install -g ngrok
```

### Utilisation
```bash
# Expose ton serveur local sur HTTPS
ngrok http 3000
```

Tu obtiendras une URL comme : `https://abc123.ngrok.io`

### Configuration Stripe
1. Va dans ton Dashboard Stripe
2. Webhooks > Ajouter un endpoint
3. URL : `https://abc123.ngrok.io/api/payment/webhook`
4. Copie le secret webhook

## **Option 3 : Désactiver temporairement les webhooks**

Pour le développement, tu peux temporairement désactiver les webhooks et simuler les événements : 