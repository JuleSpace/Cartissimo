const { defineConfig } = require('@vue/cli-service')
const os = require('os')

// Fonction pour détecter automatiquement l'IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Ignorer les interfaces loopback et non-IPv4
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  return 'localhost';
}

const IP = process.env.VUE_APP_IP || getLocalIP();
const API_TARGET = `http://${IP}:3000`;

console.log(`Configuration Vue.js - IP détectée: ${IP}`);
console.log(`Proxy API configuré vers: ${API_TARGET}`);

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    allowedHosts: 'all',
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        secure: false
      }
    }
  },
  chainWebpack: config => {
    config.plugins.delete('workbox')
  }
}) 