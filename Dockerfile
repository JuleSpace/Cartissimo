# Dockerfile multi-étapes pour Cartissimo
FROM node:18-alpine AS frontend-builder

# Installer git (requis pour certaines dépendances)
RUN apk add --no-cache git

# Build du frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./

# Debug: vérifier les fichiers package
RUN echo "📦 Package files:" && ls -la && echo "📋 Package.json content:" && cat package.json

# Installation avec plus de détails
RUN npm ci --verbose

COPY frontend/ ./

# Debug: vérifier les fichiers copiés
RUN echo "📁 Frontend files:" && ls -la

# Build avec gestion d'erreur
RUN echo "🔄 Starting build..." && npm run build || (echo "❌ Build failed, checking logs..." && npm run build --verbose && exit 1)

# Vérifier que le build est correct
RUN echo "🔍 Vérification du build frontend:" && ls -la dist/ && head -5 dist/index.html

FROM node:18-alpine AS backend-setup

# Installation backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ ./

FROM node:18-alpine AS production

# Copier le backend
WORKDIR /app
COPY --from=backend-setup /app/backend ./backend/

# Copier le frontend buildé APRÈS le backend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist/

# Vérifier que tout est en place
RUN echo "🔍 Vérification finale:" && \
    echo "Backend:" && ls -la backend/ && \
    echo "Frontend:" && ls -la frontend/dist/ && \
    echo "Index.html:" && head -5 frontend/dist/index.html

EXPOSE 8080

# Démarrer le backend
CMD ["node", "backend/src/index.js"] 