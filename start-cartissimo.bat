@echo off
echo Démarrage de Cartissimo...

cd /d %~dp0
echo Dossier courant: %CD%

REM Demander l'IP si elle n'est pas définie
if "%IP%"=="" (
    set /p IP=Entrez l'adresse IP de votre machine: 
)

echo IP configurée: %IP%

echo Démarrage du backend...
cd backend
if not exist ecosystem.config.js (
    echo ERREUR: ecosystem.config.js non trouvé dans backend
    pause
    exit /b 1
)
REM Passer l'IP au backend via les variables d'environnement de PM2
REM Note: La méthode exacte dépend de comment ecosystem.config.js lit l'IP
REM Si ecosystem.config.js lit process.env.IP, PM2 devrait l'hériter du set global.
start /B pm2 start ecosystem.config.js
echo Backend démarré

echo Préparation et démarrage du frontend...
cd ../frontend

REM Étape 1: Définir la variable d'environnement pour le build
echo Définition de VUE_APP_IP=%IP% pour le build frontend...
set VUE_APP_IP=%IP%

REM Étape 2: Construire le frontend avec la bonne IP
echo Construction du frontend (npm run build)...
call npm run build
if %errorlevel% neq 0 (
    echo ERREUR: Le build du frontend a échoué.
    pause
    exit /b 1
)
echo Build du frontend terminé.

REM Étape 3: Démarrer le serveur frontend avec PM2 (qui servira le dossier 'dist' nouvellement construit)
if not exist ecosystem.config.js (
    echo ERREUR: ecosystem.config.js non trouvé dans frontend
    pause
    exit /b 1
)
echo Démarrage du serveur frontend via PM2...
start /B pm2 start ecosystem.config.js
echo Frontend démarré

echo Vérification des processus...
timeout /t 5
pm2 status

echo Configuration terminée
pause 