const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  
  // Configuration PWA
  pwa: {
    name: 'Cartissimo',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxPluginMode: 'GenerateSW'
  },

  // Configuration pour la production
  productionSourceMap: false, // Désactiver les source maps en production pour accélérer le build
  
  // Parallel build désactivé pour Docker (peut causer des problèmes de mémoire)
  parallel: false,
  
  // Optimisations pour le build Railway/Docker
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxSize: 200000, // Limiter la taille des chunks à 200KB
      }
    },
    // Augmenter la limite de mémoire pour le build
    performance: {
      maxAssetSize: 500000,
      maxEntrypointSize: 500000,
    }
  },
  
  // Optimiser les assets
  chainWebpack: config => {
    // Désactiver le préchargement pour éviter les erreurs de build
    config.plugins.delete('preload');
    config.plugins.delete('prefetch');
    
    // Optimiser les images de manière plus simple
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 8192,
        name: 'img/[name].[hash:8].[ext]'
      });
  }
});