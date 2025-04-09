module.exports = {
  apps: [{
    name: "cartissimo",
    script: "src/index.js",
    env: {
      NODE_ENV: "production",
      PORT: 3000,
      HOST: "0.0.0.0",
      IP: process.env.IP || "localhost"
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: "logs/err.log",
    out_file: "logs/out.log",
    log_file: "logs/combined.log",
    time: true
  }]
} 