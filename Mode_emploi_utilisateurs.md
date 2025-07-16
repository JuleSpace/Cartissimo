# Mode d'emploi Cartissimo

## Table des matières
1. [Présentation de l'application](#présentation-de-lapplication)
2. [Connexion](#connexion)
3. [Interface Parent](#interface-parent)
4. [Interface Orthophoniste](#interface-orthophoniste)
5. [Interface Administrateur](#interface-administrateur)
6. [Utilisation des animations](#utilisation-des-animations)
7. [Abonnement et paiement](#abonnement-et-paiement)
8. [Dépannage](#dépannage)

## Présentation de l'application

Cartissimo est une application éducative conçue pour aider les enfants malentendants dans leur apprentissage grâce à des animations visuelles et sonores. L'application propose 8 thèmes avec 10 animations chacun, offrant un total de 80 animations éducatives.

### Thèmes disponibles :
1. **Animaux de la Ferme** - Vache, cochon, poule, mouton, etc.
2. **Véhicules** - Voiture, train, avion, bateau, etc.
3. **Animaux domestiques** - Chat, chien, lapin, oiseau, etc.
4. **Instruments de musique** - Piano, guitare, tambour, etc.
5. **Animaux de la savane** - Lion, éléphant, girafe, etc.
6. **Outils/Électroménagers** - Marteau, perceuse, aspirateur, etc.
7. **Animaux sauvages** - Ours, loup, renard, etc.
8. **Animaux marins** - Poisson, dauphin, baleine, etc.

## Connexion

### Accès à l'application
1. Ouvrez votre navigateur web
2. Allez à l'adresse de l'application (fournie par votre administrateur)
3. Vous arrivez sur la page de connexion

### Identifiants par défaut
- **Administrateur** : admin@cartissimo.com / Admin123!
- **Orthophoniste** : therapeute@cartissimo.com / Therapeute123!
- **Parent** : parent@cartissimo.com / Parent123!

### Première connexion
1. Saisissez votre email et mot de passe
2. Cliquez sur "Se connecter"
3. Vous êtes automatiquement redirigé vers l'interface correspondant à votre rôle

## Interface Parent

### Vue d'ensemble
Les parents ont accès à un système de déverrouillage progressif des thèmes pour leurs enfants.

### Fonctionnalités principales

#### 1. Consultation des thèmes
- **Thèmes débloqués** : Les 2 premiers thèmes sont automatiquement accessibles
- **Thèmes verrouillés** : Affichés en grisé avec indication du thème à compléter
- **Progression** : Chaque thème affiche son numéro d'ordre dans une pastille bleue

#### 2. Déverrouillage progressif
- Complétez toutes les animations du thème actuel
- Le thème suivant se débloque automatiquement
- Vous ne pouvez pas "sauter" de thème

#### 3. Visualisation des animations
- Cliquez sur un thème débloqué pour voir ses animations
- Chaque animation comprend :
  - Une version animée (dessin animé)
  - Une version réelle (photo/vidéo)
  - Un son correspondant

#### 4. Navigation
- **Bouton "Suivant"** : Passe à l'animation suivante
- **Bouton "Précédent"** : Retourne à l'animation précédente
- **Bouton "Retour"** : Retourne à la liste des thèmes

### Gestion de l'abonnement
- **Vérification automatique** : L'application vérifie votre statut d'abonnement
- **Abonnement requis** : 50€/an pour accéder aux thèmes
- **Paiement sécurisé** : Via Stripe
- **Renouvellement** : Automatique ou manuel selon votre choix

## Interface Orthophoniste

### Vue d'ensemble
Les orthophonistes peuvent gérer leurs patients et accorder des accès spéciaux aux thèmes.

### Fonctionnalités principales

#### 1. Dashboard
- **Accès direct** : Bouton "Dashboard" dans la barre de navigation
- **Vue d'ensemble** : Tous vos patients et leurs accès
- **Gestion centralisée** : Toutes les actions patient depuis une interface

#### 2. Gestion des patients
- **Liste des patients** : Voir tous vos patients assignés
- **Détails patient** : Nom, email, statut d'abonnement
- **Patients non assignés** : Voir les patients sans thérapeute

#### 3. Gestion des accès aux thèmes
- **Accès manuel** : Accorder l'accès à un thème spécifique
- **Déverrouillage d'urgence** : Débloquer un thème sans compléter le précédent
- **Suivi des progrès** : Voir quels thèmes sont complétés

#### 4. Création de thèmes
- **Nouveau thème** : Bouton "Créer un nouveau thème"
- **Ajout d'animations** : Jusqu'à 10 animations par thème
- **Validation** : Soumission pour approbation admin

### Procédure d'accès manuel
1. Allez dans votre Dashboard
2. Trouvez le patient concerné
3. Cliquez sur "Gérer les accès"
4. Sélectionnez le thème à débloquer
5. Confirmez l'action

## Interface Administrateur

### Vue d'ensemble
Les administrateurs ont un contrôle total sur l'application et peuvent gérer tous les aspects.

### Fonctionnalités principales

#### 1. Panneau d'administration
- **Bouton "Administration"** : Accès depuis la barre de navigation
- **Onglets organisés** : Gestion par catégories

#### 2. Gestion des utilisateurs
- **Liste complète** : Tous les utilisateurs (admins, orthophonistes, parents)
- **Création** : Nouveaux comptes utilisateur
- **Modification** : Rôles et permissions
- **Suppression** : Suppression de comptes

#### 3. Gestion des orthophonistes
- **Création** : Nouveaux comptes orthophonistes
- **Profils détaillés** : Informations professionnelles
- **Assignation** : Lier patients et thérapeutes

#### 4. Gestion des thèmes
- **Validation** : Approuver ou rejeter les thèmes soumis
- **Ordre des thèmes** : Interface drag & drop pour réorganiser
- **Statuts** : Pending, Approved, Rejected

#### 5. Gestion des animations
- **Validation** : Approuver les animations soumises
- **Contrôle qualité** : Vérifier les fichiers (GIF, son)
- **Organisation** : Ranger par thème et catégorie

### Procédure de validation
1. Allez dans le panneau d'administration
2. Onglet "Validation des thèmes" ou "Validation des animations"
3. Examinez le contenu soumis
4. Cliquez sur "Approuver" ou "Rejeter"
5. Ajoutez des commentaires si nécessaire

## Utilisation des animations

### Interface de visualisation
L'interface animations est optimisée pour une utilisation intuitive par les enfants.

### Fonctionnalités

#### 1. Affichage
- **Écran principal** : Animation centrée
- **Nom** : Affiché en haut
- **Contrôles** : Boutons grands et visibles

#### 2. Types d'animations
- **Version animée** : Dessin animé coloré
- **Version réelle** : Photo ou vidéo réelle
- **Basculement** : Clic pour changer de version

#### 3. Audio
- **Lecture automatique** : Son joué automatiquement
- **Contrôle volume** : Ajustable
- **Répétition** : Possibilité de rejouer

#### 4. Navigation
- **Flèches** : Précédent/Suivant
- **Indicateur** : Position dans la série (ex: 3/10)
- **Retour** : Bouton pour revenir aux thèmes

### Utilisation recommandée
1. Commencez par la version animée
2. Écoutez le son associé
3. Passez à la version réelle
4. Répétez si nécessaire
5. Passez à l'animation suivante

## Abonnement et paiement

### Système d'abonnement
- **Cible** : Parents uniquement
- **Tarif** : 50€ par an
- **Paiement** : Stripe (sécurisé)
- **Renouvellement** : Automatique

### Processus de paiement
1. **Détection** : L'application détecte le besoin d'abonnement
2. **Affichage** : Écran d'abonnement avec avantages
3. **Redirection** : Vers l'interface Stripe
4. **Paiement** : Saisie des informations bancaires
5. **Confirmation** : Retour sur l'application avec accès activé

### Statuts d'abonnement
- **Active** : Accès complet
- **Inactive** : Pas d'abonnement
- **Expired** : Abonnement expiré
- **Payment_failed** : Problème de paiement

### Gestion des problèmes
- **Paiement refusé** : Vérifiez vos informations bancaires
- **Abonnement expiré** : Renouvelez via le bouton "Renouveler"
- **Support** : Contactez l'équipe technique

## Dépannage

### Problèmes courants

#### 1. Connexion impossible
- **Vérifiez** : Email et mot de passe corrects
- **Majuscules** : Attention à la casse
- **Navigateur** : Essayez un autre navigateur
- **Cache** : Videz le cache navigateur

#### 2. Animations qui ne se chargent pas
- **Connexion** : Vérifiez votre connexion internet
- **Navigateur** : Rechargez la page (F5)
- **Bloqueur** : Désactivez les bloqueurs de publicité
- **Support** : Contactez l'équipe technique

#### 3. Son qui ne fonctionne pas
- **Volume** : Vérifiez le volume système
- **Autorisation** : Autorisez le son dans le navigateur
- **Casque** : Testez avec/sans casque
- **Navigateur** : Essayez un autre navigateur

#### 4. Thème non débloqué
- **Progression** : Vérifiez que le thème précédent est complété
- **Orthophoniste** : Contactez votre thérapeute
- **Accès manuel** : Demandez un déverrouillage

#### 5. Problèmes de paiement
- **Informations** : Vérifiez vos données bancaires
- **Banque** : Contactez votre banque
- **Stripe** : Vérifiez les emails de Stripe
- **Support** : Contactez l'équipe Cartissimo

### Contacts support
- **Email technique** : support@cartissimo.com
- **Téléphone** : 01 23 45 67 89
- **Horaires** : 9h-17h, du lundi au vendredi

### Conseils d'utilisation
1. **Régularité** : Utilisez l'application régulièrement
2. **Progression** : Respectez l'ordre des thèmes
3. **Patience** : Laissez du temps à l'enfant
4. **Encouragement** : Félicitez les progrès
5. **Support** : N'hésitez pas à contacter l'équipe

---

*Ce mode d'emploi est régulièrement mis à jour. Pour la version la plus récente, consultez l'application ou contactez l'équipe Cartissimo.* 