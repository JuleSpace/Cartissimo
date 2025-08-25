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

  // Optimisations pour le build Railway
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxSize: 200000, // Limiter la taille des chunks à 200KB
      }
    }
  },

  // Configuration pour la production
  productionSourceMap: false, // Désactiver les source maps en production pour accélérer le build
  
  // Parallel build pour accélérer
  parallel: require('os').cpus().length > 1,
  
  // Optimiser les assets
  chainWebpack: config => {
    // Optimiser les images
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 8192,
        name: 'img/[name].[hash:8].[ext]'
      });
      
    // Précharger les chunks critiques seulement
    config.plugin('preload').tap(options => {
      options[0] = {
        rel: 'preload',
        include: 'initial',
        fileBlacklist: [/\.map$/, /hot-update\.js$/]
      };
      return options;
    });
  }
});