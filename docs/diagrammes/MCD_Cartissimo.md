# 📊 MCD (Modèle Conceptuel de Données) - Cartissimo

## Vue d'ensemble
Ce diagramme présente la structure complète de la base de données du projet **Cartissimo**, une application d'orthophonie interactive pour enfants.

## Diagramme

```mermaid
erDiagram
    USER {
        int id PK
        string email UK
        string password
        string firstName
        string lastName
        enum role "admin, orthophonist, parent"
        boolean subscriptionRequired
        datetime createdAt
        datetime updatedAt
    }
    
    PATIENT {
        int id PK
        string firstName
        string lastName
        date birthDate
        string parentEmail
        int userId FK
        enum subscriptionStatus "active, inactive, expired, payment_failed"
        date subscriptionEndDate
        string stripeSubscriptionId
        int orthophonisteId FK
        datetime createdAt
        datetime updatedAt
    }
    
    ORTHOPHONISTE {
        int id PK
        string firstName
        string lastName
        string email UK
        string phone
        text address
        string city
        string postalCode
        string profilePictureUrl
        string doctolibUrl
        datetime createdAt
        datetime updatedAt
    }
    
    THEME {
        int id PK
        string name
        text description
        string image
        enum status "pending, approved, rejected"
        int createdBy FK
        int order
        datetime createdAt
        datetime updatedAt
    }
    
    ANIMATION {
        int id PK
        string name
        text description
        string animatedGifPath
        string realGifPath
        string soundPath
        int duration
        int width
        int height
        enum status "pending, approved, rejected"
        int themeId FK
        int createdBy FK
        datetime createdAt
        datetime updatedAt
    }
    
    USER_THEME {
        int userId PK,FK
        int themeId PK,FK
        datetime createdAt
        datetime updatedAt
    }
    
    PATIENT_THERAPIST {
        int id PK
        int patientId FK
        int therapistId FK
        datetime createdAt
        datetime updatedAt
    }
    
    THEME_COMPLETION {
        int id PK
        int userId FK
        int themeId FK
        datetime createdAt
        datetime updatedAt
    }

    %% Relations
    USER ||--o{ PATIENT : "has children"
    USER ||--o{ ANIMATION : "creates"
    USER ||--o{ THEME : "creates"
    USER ||--o{ THEME_COMPLETION : "completes"
    
    ORTHOPHONISTE ||--o{ PATIENT : "follows"
    
    THEME ||--o{ ANIMATION : "contains"
    THEME ||--o{ THEME_COMPLETION : "is completed"
    
    USER }o--o{ THEME : USER_THEME
    USER }o--o{ PATIENT : PATIENT_THERAPIST
```

## Description des entités

### 👤 USER
- **Rôle** : Utilisateurs principaux du système (admin, orthophoniste, parent)
- **Caractéristiques** : Authentification, profil, permissions selon le rôle

### 👶 PATIENT  
- **Rôle** : Enfants bénéficiaires des thérapies
- **Caractéristiques** : Informations personnelles, statut d'abonnement, liaison parent/thérapeute

### 👨‍⚕️ ORTHOPHONISTE
- **Rôle** : Professionnels de santé créateurs de contenu
- **Caractéristiques** : Profil professionnel, coordonnées, intégration Doctolib

### 🎨 THEME
- **Rôle** : Contenus éducatifs thématiques
- **Caractéristiques** : Workflow d'approbation, ordre d'affichage, créateur

### 🎬 ANIMATION
- **Rôle** : Éléments multimédias interactifs
- **Caractéristiques** : Fichiers GIF animés/réels, sons, dimensions, statut

### 🔗 Tables de liaison
- **USER_THEME** : Accès aux thèmes par utilisateur
- **PATIENT_THERAPIST** : Relations patient-thérapeute
- **THEME_COMPLETION** : Suivi de progression des thèmes

## Relations principales
- Un **parent** peut avoir plusieurs **enfants** (patients)
- Un **orthophoniste** peut suivre plusieurs **patients**
- Un **thème** peut contenir plusieurs **animations**
- Les **utilisateurs** peuvent avoir accès à plusieurs **thèmes** (many-to-many)
- Les **patients** peuvent être suivis par plusieurs **thérapeutes** (many-to-many)

---
*Généré pour le projet Cartissimo - Application d'orthophonie interactive* 