 

[Region: europe-west4]

=========================

Using Detected Dockerfile

=========================


context: 5j2q-AnSa

[internal] load build definition from Dockerfile

[internal] load build definition from Dockerfile  ✔ 0 ms

[internal] load build definition from Dockerfile

[internal] load build definition from Dockerfile  ✔ 12 ms

[internal] load metadata for docker.io/library/node:18-alpine

[auth] library/node:pull token for registry-1.docker.io

[auth] library/node:pull token for registry-1.docker.io  ✔ 0 ms

[internal] load metadata for docker.io/library/node:18-alpine  ✔ 1 s

[internal] load .dockerignore

[internal] load .dockerignore  ✔ 0 ms

[internal] load .dockerignore

[internal] load .dockerignore  ✔ 8 ms

[frontend-builder 5/7] COPY frontend/ ./

[frontend-builder 4/7] RUN npm ci

[frontend-builder 3/7] COPY frontend/package*.json ./

[frontend-builder 2/7] WORKDIR /app/frontend

[production 3/5] COPY --from=backend-setup /app/backend ./backend/

[frontend-builder 1/7] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e

[backend-setup 4/5] RUN npm ci --only=production

[backend-setup 3/5] COPY backend/package*.json ./

[internal] load build context

[backend-setup 2/5] WORKDIR /app/backend

[production 2/5] WORKDIR /app

[frontend-builder 6/7] RUN npm run build

[backend-setup 5/5] COPY backend/ ./

[production 5/5] RUN echo "🔍 Vérification finale:" &&     echo "Backend:" && ls -la backend/ &&     echo "Frontend:" && ls -la frontend/dist/ &&     echo "Index.html:" && head -5 frontend/dist/index.html

[production 4/5] COPY --from=frontend-builder /app/frontend/dist ./frontend/dist/

[frontend-builder 7/7] RUN echo "🔍 Vérification du build frontend:" && ls -la dist/ && head -5 dist/index.html

[frontend-builder 1/7] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e

[internal] load build context  ✔ 0 ms

[frontend-builder 1/7] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e  ✔ 6 ms

[frontend-builder 1/7] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e

[frontend-builder 1/7] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e  ✔ 0 ms

[frontend-builder 1/7] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e

[internal] load build context

[frontend-builder 1/7] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e  ✔ 27 ms

[frontend-builder 1/7] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e

[frontend-builder 1/7] FROM docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d0a35cb9bc4b8ca09d9e  ✔ 475 ms

[backend-setup 2/5] WORKDIR /app/backend  ✔ 25 ms

[production 2/5] WORKDIR /app  ✔ 27 ms

[frontend-builder 2/7] WORKDIR /app/frontend  ✔ 28 ms

[internal] load build context  ✔ 2 s

[frontend-builder 3/7] COPY frontend/package*.json ./

[backend-setup 3/5] COPY backend/package*.json ./

[frontend-builder 3/7] COPY frontend/package*.json ./  ✔ 96 ms

[backend-setup 3/5] COPY backend/package*.json ./  ✔ 96 ms

[frontend-builder 4/7] RUN npm ci

[backend-setup 4/5] RUN npm ci --only=production

npm warn config only Use `--omit=dev` to omit dev dependencies from the install.


added 138 packages, and audited 139 packages in 2s



18 packages are looking for funding
  run `npm fund` for details


found 0 vulnerabilities

npm notice
npm notice New major version of npm available! 10.8.2 -> 11.4.2
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.4.2
npm notice To update run: npm install -g npm@11.4.2
npm notice

[backend-setup 4/5] RUN npm ci --only=production  ✔ 2 s

[backend-setup 5/5] COPY backend/ ./

[backend-setup 5/5] COPY backend/ ./  ✔ 675 ms

npm warn deprecated stable@0.1.8: Modern JS already guarantees Array#sort() is a stable sort, so this library is deprecated. See the compatibility table on MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#browser_compatibility

npm warn deprecated sourcemap-codec@1.4.8: Please use @jridgewell/sourcemap-codec instead

npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported

npm warn deprecated rollup-plugin-terser@7.0.2: This package has been deprecated and is no longer maintained. Please use @rollup/plugin-terser

[production 3/5] COPY --from=backend-setup /app/backend ./backend/

npm warn deprecated webpack-chain@6.5.1: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.

npm warn deprecated workbox-cacheable-response@6.6.0: workbox-background-sync@6.6.0

npm warn deprecated workbox-google-analytics@6.6.0: It is not compatible with newer versions of GA starting with v4, as long as you are using GAv3 it should be ok, but the package is not longer being maintained

npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.

[production 3/5] COPY --from=backend-setup /app/backend ./backend/  ✔ 1 s

npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported

npm warn deprecated consolidate@0.15.1: Please upgrade to consolidate v1.0.0+ as it has been modernized with several long-awaited fixes implemented. Maintenance is supported by Forward Email at https://forwardemail.net ; follow/watch https://github.com/ladjs/consolidate for updates and release changelog

npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead

npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead

npm warn deprecated @babel/plugin-proposal-class-properties@7.18.6: This proposal has been merged to the ECMAScript standard and thus this plugin is no longer maintained. Please use @babel/plugin-transform-class-properties instead.

npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.


added 1090 packages, and audited 1091 packages in 12s

197 packages are looking for funding
  run `npm fund` for details


17 vulnerabilities (3 low, 10 moderate, 4 high)

To address issues that do not require attention, run:
  npm audit fix

To address all issues possible (including breaking changes), run:
  npm audit fix --force

Some issues need review, and may require choosing
a different dependency.

Run `npm audit` for details.

npm notice
npm notice New major version of npm available! 10.8.2 -> 11.4.2
npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.4.2
npm notice To update run: npm install -g npm@11.4.2
npm notice

[frontend-builder 4/7] RUN npm ci  ✔ 12 s

[frontend-builder 5/7] COPY frontend/ ./

[frontend-builder 5/7] COPY frontend/ ./  ✔ 246 ms

[frontend-builder 6/7] RUN npm run build


> app-handicap-frontend@1.0.0 build
> vue-cli-service build


Configuration Vue.js - IP détectée: 10.10.0.9

Proxy API configuré vers: http://10.10.0.9:3000

All browser targets in the browserslist configuration have supported ES module.
Therefore we don't build two separate bundles for differential loading.




-  Building for production...

 WARNING  Compiled with 3 warnings2:05:48 PM


 warning  

asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).
This can impact web performance.
Assets: 
  js/chunk-vendors.bb3d06b2.js (369 KiB)


 warning  


entrypoint size limit: The following entrypoint(s) combined asset size exceeds the recommended limit (244 KiB). This can impact web performance.
Entrypoints:
  app (526 KiB)
      js/chunk-vendors.bb3d06b2.js
      css/app.3379de9c.css
      js/app.48d9a5f7.js



 warning  

webpack performance recommendations: 
You can limit the size of your bundles by using import() or require.ensure to lazy load some parts of your application.
For more info visit https://webpack.js.org/guides/code-splitting/




drwxrwxr-x    1 root     root          4096 Jul 19 14:05 .
drwxr-xr-x    1 root     root          4096 Jul 19 14:04 ..
drwxr-xr-x    2 root     root          4096 Jul 19 14:05 css
-rw-r--r--    1 root     root        178852 Jul 19 14:05 favicon.ico
drwxr-xr-x    2 root     root          4096 Jul 19 14:05 icons
-rw-r--r--    1 root     root          2867 Jul 19 14:05 index.html
drwxr-xr-x    2 root     root          4096 Jul 19 14:05 js
-rw-r--r--    1 root     root           763 Jul 19 14:05 manifest.json
-rw-r--r--    1 root     root          1864 Jul 19 14:05 service-worker.js

<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><!--[if IE]><link rel="icon" href="/favicon.ico"><![endif]--><title>Cartissimo</title><meta name="theme-color" content="#4B95DE"><meta name="description" content="Application d'animations pour enfants"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Cartissimo"><link rel="apple-touch-icon" href="/icons/icon-152x152.png"><link rel="manifest" href="/manifest.json"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Cartissimo"><link rel="apple-touch-icon" href="/logo192.png"><link rel="apple-touch-icon" sizes="152x152" href="/logo152.png"><link rel="apple-touch-icon" sizes="180x180" href="/logo180.png"><link rel="apple-touch-icon" sizes="167x167" href="/logo167.png"><link rel="apple-touch-startup-image" href="/splash.png"><script defer="defer" src="/js/chunk-vendors.bb3d06b2.js"></script><script defer="defer" src="/js/app.48d9a5f7.js"></script><link href="/css/app.3379de9c.css" rel="stylesheet"><link rel="icon" type="image/svg+xml" href="/img/icons/favicon.svg"><link rel="icon" type="image/png" sizes="32x32" href="/img/icons/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/img/icons/favicon-16x16.png"><link rel="manifest" href="/manifest.json"><meta name="theme-color" content="#4DBA87"><meta name="apple-mobile-web-app-capable" content="no"><meta name="apple-mobile-web-app-status-bar-style" content="default"><meta name="apple-mobile-web-app-title" content="app-handicap-frontend"><link rel="apple-touch-icon" href="/img/icons/apple-touch-icon-152x152.png"><link rel="mask-icon" href="/img/icons/safari-pinned-tab.svg" color="#4DBA87"><meta name="msapplication-TileImage" content="/img/icons/msapplication-icon-144x144.png"><meta name="msapplication-TileColor" content="#000000"></head><body><noscript><strong>Nous sommes désolés mais Cartissimo ne fonctionne pas correctement sans JavaScript activé. Veuillez l'activer pour continuer.</strong></noscript><div id="app"></div><script>if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
              console.log('ServiceWorker enregistré avec succès:', registration.scope);

[frontend-builder 7/7] RUN echo "🔍 Vérification du build frontend:" && ls -la dist/ && head -5 dist/index.html  ✔ 109 ms

[production 4/5] COPY --from=frontend-builder /app/frontend/dist ./frontend/dist/

[production 4/5] COPY --from=frontend-builder /app/frontend/dist ./frontend/dist/  ✔ 103 ms

[production 5/5] RUN echo "🔍 Vérification finale:" &&     echo "Backend:" && ls -la backend/ &&     echo "Frontend:" && ls -la frontend/dist/ &&     echo "Index.html:" && head -5 frontend/dist/index.html

🔍 Vérification finale:
Backend:

total 108

drwxr-xr-x    7 root     root          4096 Jul 19 14:04 .
drwxr-xr-x    1 root     root          4096 Jul 19 14:05 ..
-rw-rw-r--    1 root     root           775 Jul 19 14:04 .env
drwxrwxr-x    2 root     root          4096 Jul 19 14:04 config
-rw-rw-r--    1 root     root           419 Jul 19 14:04 ecosystem.config.js
drwxrwxr-x    2 root     root          4096 Jul 19 14:04 migrations
drwxr-xr-x  130 root     root          4096 Jul 19 14:05 node_modules
-rw-rw-r--    1 root     root         68259 Jul 19 14:04 package-lock.json
-rw-rw-r--    1 root     root           624 Jul 19 14:04 package.json
drwxrwxr-x    5 root     root          4096 Jul 19 14:04 public
drwxrwxr-x    9 root     root          4096 Jul 19 14:04 src

Frontend:

total 208

drwxr-xr-x    5 root     root          4096 Jul 19 14:05 .
drwxr-xr-x    3 root     root          4096 Jul 19 14:05 ..
drwxr-xr-x    2 root     root          4096 Jul 19 14:05 css
-rw-r--r--    1 root     root        178852 Jul 19 14:05 favicon.ico
drwxr-xr-x    2 root     root          4096 Jul 19 14:05 icons
-rw-r--r--    1 root     root          2867 Jul 19 14:05 index.html
drwxr-xr-x    2 root     root          4096 Jul 19 14:05 js
-rw-r--r--    1 root     root           763 Jul 19 14:05 manifest.json
-rw-r--r--    1 root     root          1864 Jul 19 14:05 service-worker.js

Index.html:

<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><!--[if IE]><link rel="icon" href="/favicon.ico"><![endif]--><title>Cartissimo</title><meta name="theme-color" content="#4B95DE"><meta name="description" content="Application d'animations pour enfants"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Cartissimo"><link rel="apple-touch-icon" href="/icons/icon-152x152.png"><link rel="manifest" href="/manifest.json"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Cartissimo"><link rel="apple-touch-icon" href="/logo192.png"><link rel="apple-touch-icon" sizes="152x152" href="/logo152.png"><link rel="apple-touch-icon" sizes="180x180" href="/logo180.png"><link rel="apple-touch-icon" sizes="167x167" href="/logo167.png"><link rel="apple-touch-startup-image" href="/splash.png"><script defer="defer" src="/js/chunk-vendors.bb3d06b2.js"></script><script defer="defer" src="/js/app.48d9a5f7.js"></script><link href="/css/app.3379de9c.css" rel="stylesheet"><link rel="icon" type="image/svg+xml" href="/img/icons/favicon.svg"><link rel="icon" type="image/png" sizes="32x32" href="/img/icons/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/img/icons/favicon-16x16.png"><link rel="manifest" href="/manifest.json"><meta name="theme-color" content="#4DBA87"><meta name="apple-mobile-web-app-capable" content="no"><meta name="apple-mobile-web-app-status-bar-style" content="default"><meta name="apple-mobile-web-app-title" content="app-handicap-frontend"><link rel="apple-touch-icon" href="/img/icons/apple-touch-icon-152x152.png"><link rel="mask-icon" href="/img/icons/safari-pinned-tab.svg" color="#

4DBA87"><meta name="msapplication-TileImage" content="/img/icons/msapplication-icon-144x144.png"><meta name="msapplication-TileColor" content="#000000"></head><body><noscript><strong>Nous sommes désolés mais Cartissimo ne fonctionne pas correctement sans JavaScript activé. Veuillez l'activer pour continuer.</strong></noscript><div id="app"></div><script>if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
              console.log('ServiceWorker enregistré avec succès:', registration.scope);

[production 5/5] RUN echo "🔍 Vérification finale:" &&     echo "Backend:" && ls -la backend/ &&     echo "Frontend:" && ls -la frontend/dist/ &&     echo "Index.html:" && head -5 frontend/dist/index.html  ✔ 99 ms

exporting to docker image format

exporting to image

[auth] sharing credentials for production-europe-west4-drams3a.railway-registry.com

[auth] sharing credentials for production-europe-west4-drams3a.railway-registry.com  ✔ 0 ms

importing to docker

importing to docker  ✔ 4 s

Build time: 57.45 seconds

 

====================

Starting Healthcheck

====================


Path: /api/health

Retry window: 5m0s

 

[1/1] Healthcheck succeeded!