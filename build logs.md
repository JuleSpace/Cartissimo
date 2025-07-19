-  Building for production...

 WARNING  Compiled with 3 warnings1:27:26 PM



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


  File                                 Size               Gzipped

  dist/js/chunk-vendors.bb3d06b2.js    369.35 KiB         128.30 KiB
  dist/js/app.48d9a5f7.js              105.82 KiB         23.37 KiB
  dist/service-worker.js               1.82 KiB           0.65 KiB
  dist/css/app.3379de9c.css            50.93 KiB          8.49 KiB

  Images and other types of assets omitted.
  Build at: 2025-07-19T13:27:26.772Z - Hash: f590541094a13277 - Time: 8716ms


 DONE  Build complete. The dist directory is ready to be deployed.

 INFO  Check out deployment instructions at https://cli.vuejs.org/guide/deployment.html
       

✅ Build terminé

total 212
drwxr-xr-x 5 root root   4096 Jul 19 13:27 .
drwxr-xr-x 1 root root   4096 Jul 19 13:27 ..
drwxr-xr-x 2 root root   4096 Jul 19 13:27 css
-rw-r--r-- 1 root root 178852 Jul 19 13:27 favicon.ico
drwxr-xr-x 2 root root   4096 Jul 19 13:27 icons
-rw-r--r-- 1 root root   2867 Jul 19 13:27 index.html
drwxr-xr-x 2 root root   4096 Jul 19 13:27 js
-rw-r--r-- 1 root root    763 Jul 19 13:27 manifest.json
-rw-r--r-- 1 root root   1864 Jul 19 13:27 service-worker.js

🔍 Vérification index.html:

<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><!--[if IE]><link rel="icon" href="/favicon.ico"><![endif]--><title>Cartissimo</title><meta name="theme-color" content="#4B95DE"><meta name="description" content="Application d'animations pour enfants"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Cartissimo"><link rel="apple-touch-icon" href="/icons/icon-152x152.png"><link rel="manifest" href="/manifest.json"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Cartissimo"><link rel="apple-touch-icon" href="/logo192.png"><link rel="apple-touch-icon" sizes="152x152" href="/logo152.png"><link rel="apple-touch-icon" sizes="180x180" href="/logo180.png"><link rel="apple-touch-icon" sizes="167x167" href="/logo167.png"><link rel="apple-touch-startup-image" href="/splash.png"><script defer="defer" src="/js/chunk-vendors.bb3d06b2.js"></script><script defer="defer" src="/js/app.48d9a5f7.js"></script><link href="/css/app.3379de9c.css" rel="stylesheet"><link rel="icon" type="image/svg+xml" href="/img/icons/favicon.svg"><link rel="icon" type="image/png" sizes="32x32" href="/img/icons/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/img/icons/favicon-16x16.png"><link rel="manifest" href="/manifest.json"><meta name="theme-color" content="#4DBA87"><meta name="apple-mobile-web-app-capable" content="no"><meta name="apple-mobile-web-app-status-bar-style" content="default"><meta name="apple-mobile-web-app-title" content="app-handicap-frontend"><link rel="apple-touch-icon" href="/img/icons/apple-touch-icon-152x152.png"><link rel="mask-icon" href="/img/icons/safari-pinned-tab.svg" color="#4DBA87"><meta name="msapplication-TileImage" content="/img/icons/msapplication-icon-144x144.png"><meta name="msapplication-TileColor" content="#000000"></head><body><noscript><strong>Nous sommes désolés mais Cartissimo ne fonctionne pas correctement sans JavaScript activé. Veuillez l'activer pour continuer.</strong></noscript><div id="app"></div><script>if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
              console.log('ServiceWorker enregistré avec succès:', registration.scope);
            })
            .catch(error => {
              console.log('Erreur d\'enregistrement du ServiceWorker:', error);
            });
        });
      }</script></body></html>

[stage-0  8/10] RUN --mount=type=cache,id=s/5f9a36a0-9dcb-4302-8a5b-28d7b543f264-node_modules/cache,target=/app/node_modules/.cache npm run build  ✔ 21 s

[stage-0  9/10] RUN printf '\nPATH=/app/node_modules/.bin:$PATH' >> /root/.profile

[stage-0  9/10] RUN printf '\nPATH=/app/node_modules/.bin:$PATH' >> /root/.profile  ✔ 278 ms

[stage-0 10/10] COPY . /app

[stage-0 10/10] COPY . /app  ✔ 377 ms

exporting to docker image format

exporting to image

[auth] sharing credentials for production-europe-west4-drams3a.railway-registry.com

[auth] sharing credentials for production-europe-west4-drams3a.railway-registry.com  ✔ 0 ms

importing to docker

importing to docker  ✔ 17 s

=== Successfully Built! ===

Run:

docker run -it production-europe-west4-drams3a.railway-registry.com/5f9a36a0-9dcb-4302-8a5b-28d7b543f264:7d70e936-96e0-498a-972b-9109f7a22ec6

Build time: 115.22 seconds