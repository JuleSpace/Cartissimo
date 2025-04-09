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
    echo ERREUR: ecosystem.config.js non trouvé dans %CD%
    pause
    exit /b 1
)
set IP=%IP%
start /B pm2 start ecosystem.config.js
echo Backend démarré

echo Démarrage du frontend...
cd ../frontend
if not exist ecosystem.config.js (
    echo ERREUR: ecosystem.config.js non trouvé dans %CD%
    pause
    exit /b 1
)
set VUE_APP_IP=%IP%
start /B pm2 start ecosystem.config.js
echo Frontend démarré

echo Vérification des processus...
timeout /t 5
pm2 status

echo Configuration terminée
pause 