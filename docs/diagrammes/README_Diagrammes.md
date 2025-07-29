# 📊 Documentation des Diagrammes - Cartissimo

## Vue d'ensemble

Cette documentation présente les trois diagrammes essentiels du projet **Cartissimo**, une application d'orthophonie interactive pour enfants.

## 📋 Index des diagrammes

| Diagramme | Description | Fichier |
|-----------|-------------|---------|
| 📊 **MCD** | Modèle Conceptuel de Données - Structure de la base de données | [MCD_Cartissimo.md](./MCD_Cartissimo.md) |
| 🏗️ **Classes** | Diagramme de Classes - Architecture orientée objet du backend | [DiagrammeClasses_Cartissimo.md](./DiagrammeClasses_Cartissimo.md) |
| 👥 **Cas d'Usage** | Diagramme de Cas d'Utilisation - Fonctionnalités par acteur | [CasUtilisation_Cartissimo.md](./CasUtilisation_Cartissimo.md) |

## 🚀 Visualisation des diagrammes

### 📊 MCD (Modèle Conceptuel de Données)

Structure complète de la base de données avec 8 entités principales :
- **User** (Utilisateurs : admin, orthophoniste, parent)
- **Patient** (Enfants avec statut d'abonnement)
- **Orthophoniste** (Professionnels de santé)
- **Theme** (Contenus éducatifs avec workflow d'approbation)
- **Animation** (Éléments multimédias interactifs)
- **Tables de liaison** (UserTheme, PatientTherapist, ThemeCompletion)

**[👉 Voir le MCD complet](./MCD_Cartissimo.md)**

---

### 🏗️ Diagramme de Classes

Architecture backend avec séparation claire :
- **Modèles** : User, Patient, Theme, Animation, etc.
- **Contrôleurs** : AuthController, ThemeController, UserController
- **Relations** : Associations et cardinalités

**[👉 Voir le diagramme de classes](./DiagrammeClasses_Cartissimo.md)**

---

### 👥 Diagramme de Cas d'Utilisation

Fonctionnalités organisées par acteur :
- **👑 Admin** : Supervision complète, validation des contenus
- **👨‍⚕️ Orthophoniste** : Création de contenu, suivi patients
- **👨‍👩‍👧‍👦 Parent** : Utilisation des thèmes, gestion famille
- **🔧 Système** : Automatisations (paiements, notifications)

**[👉 Voir les cas d'utilisation](./CasUtilisation_Cartissimo.md)**

---

## 🛠️ Utilisation dans Git

### Rendu automatique
Ces diagrammes utilisent **Mermaid**, supporté nativement par :
- ✅ **GitHub** : Rendu automatique dans les fichiers .md
- ✅ **GitLab** : Support natif Mermaid
- ✅ **Bitbucket** : Via extensions
- ✅ **Azure DevOps** : Support intégré

### Structure des fichiers
```
📁 docs/diagrammes/
├── 📄 README_Diagrammes.md       # Ce fichier (index)
├── 📄 MCD_Cartissimo.md          # Modèle Conceptuel de Données
├── 📄 DiagrammeClasses_Cartissimo.md   # Architecture des classes
└── 📄 CasUtilisation_Cartissimo.md     # Cas d'utilisation
```

### Édition des diagrammes
Pour modifier les diagrammes :
1. **Éditeur en ligne** : [Mermaid Live Editor](https://mermaid.live/)
2. **VS Code** : Extension "Mermaid Preview"
3. **IntelliJ/WebStorm** : Plugin Mermaid
4. **Modification directe** : Éditer le code Mermaid dans les fichiers .md

## 🔧 Technologies utilisées

- **Base de données** : PostgreSQL avec Sequelize ORM
- **Backend** : Node.js + Express.js
- **Frontend** : Vue.js 3 + Vuex
- **Authentification** : JWT + bcrypt
- **Paiements** : Stripe
- **Documentation** : Mermaid

## 📖 Contexte du projet

**Cartissimo** est une application web d'orthophonie interactive destinée aux enfants. Elle permet :

- 🎯 **Aux orthophonistes** : Créer des thèmes éducatifs personnalisés
- 👨‍👩‍👧‍👦 **Aux parents** : Utiliser les contenus avec leurs enfants
- 👑 **Aux admins** : Superviser et valider les contenus
- 💳 **Modèle économique** : Abonnements avec accès modulaire

## 🚀 Évolutions futures

Ces diagrammes servent de base pour :
- **Développement de nouvelles fonctionnalités**
- **Refactoring et optimisations**
- **Onboarding des nouveaux développeurs**
- **Documentation technique continue**

---

## 📞 Contact

Pour toute question sur ces diagrammes ou l'architecture du projet :
- 📧 **Email** : [Votre email]
- 💬 **Slack** : #cartissimo-dev
- 📝 **Issues** : [GitHub Issues](https://github.com/votre-repo/cartissimo/issues)

---

*Dernière mise à jour : Décembre 2024*  
*Version : 1.0*  
*Projet : Cartissimo - Application d'orthophonie interactive* 