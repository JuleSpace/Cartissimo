# 📁 Dossier Public - Fichiers Statiques

Ce dossier contient tous les fichiers statiques servis par l'application Cartissimo.

## 📂 Structure

```
public/
├── animations/        # GIF d'animations (organisés par catégorie)
│   ├── animaux/
│   ├── vehicules/
│   ├── instruments/
│   └── ...
├── sounds/           # Fichiers audio MP3
│   ├── animaux/
│   ├── vehicules/
│   └── ...
├── images/           # Images diverses
│   └── themes/       # Images uploadées pour les thèmes
└── uploads/          # Autres uploads temporaires
```

## 🔄 Synchronisation Git

### Problème
Les fichiers uploadés via l'interface web ne sont pas automatiquement ajoutés au repository Git.

### Solution
Après avoir uploadé du contenu via l'interface:

1. **Automatique** (recommandé):
   ```bash
   node backend/sync-uploads.js
   ```

2. **Manuelle**:
   ```bash
   git add backend/public/
   git commit -m "Ajout de nouveaux contenus uploadés"
   git push origin main
   ```

## 🚀 Déploiement

Une fois les fichiers commitués et pushés:
- Railway détecte automatiquement les changements
- Redéploiement automatique de l'application
- Les nouveaux fichiers sont disponibles en production

## 🔗 Accès aux fichiers

Les fichiers sont accessibles via les routes statiques:
- `/animations/categorie/fichier.gif`
- `/sounds/categorie/fichier.mp3` 
- `/images/themes/fichier.jpg`

## ⚠️ Important

- Les dossiers doivent exister (même vides) pour que multer puisse y stocker les fichiers
- Les fichiers `.gitkeep` permettent de garder les dossiers vides dans Git
- Toujours synchroniser avec Git après upload pour déployer en production