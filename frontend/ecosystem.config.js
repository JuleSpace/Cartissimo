module.exports = {
  apps: [{
    name: "cartissimo-frontend",
    script: "serve",
    env: {
      PM2_SERVE_PORT: 8080,
      PM2_SERVE_SPA: "true",
      PM2_SERVE_HOMEPAGE: "/index.html",
      PM2_SERVE_PATH: "dist"
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