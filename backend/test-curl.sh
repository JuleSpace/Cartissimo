#!/bin/bash

# Script de test pour l'upload d'images de thèmes
echo "🧪 Test upload d'image de thème"

# Créer un fichier image de test simple
echo "📝 Création d'un fichier image de test..."
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGAWA0drQAAAABJRU5ErkJggg==" | base64 -d > test-image.png

echo "🚀 Test de l'upload..."

# Tester l'upload
curl -X POST \
  -F "name=Test Theme" \
  -F "description=Description de test" \
  -F "image=@test-image.png" \
  http://localhost:3000/api/themes/test-upload \
  -v

echo ""
echo "✅ Test terminé"

# Nettoyer
rm -f test-image.png

echo "💡 Si Railway est déployé, remplace localhost:3000 par l'URL Railway"