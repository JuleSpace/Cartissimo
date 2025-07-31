#!/usr/bin/env node

/**
 * Script de synchronisation des uploads avec Git
 * 
 * Ce script aide à synchroniser les fichiers uploadés avec le repository Git.
 * À utiliser après avoir uploadé du contenu via l'interface web.
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔄 Synchronisation des uploads avec Git...');

try {
  // Se placer dans le répertoire du projet
  const projectRoot = path.join(__dirname, '..');
  process.chdir(projectRoot);
  
  // Ajouter tous les nouveaux fichiers dans public/
  console.log('📁 Ajout des fichiers dans public/...');
  execSync('git add backend/public/', { stdio: 'inherit' });
  
  // Afficher le statut
  console.log('📊 Statut Git:');
  execSync('git status', { stdio: 'inherit' });
  
  console.log('\n✅ Synchronisation terminée!');
  console.log('💡 Pour commiter et pusher:');
  console.log('   git commit -m "Ajout de nouveaux contenus uploadés"');
  console.log('   git push origin main');
  
} catch (error) {
  console.error('❌ Erreur lors de la synchronisation:', error.message);
  process.exit(1);
}