



**\[Region: europe-west4]**



**==============**



**Using Nixpacks**



**==============**





**context: v4t4-TOwM**



**╔════════ Nixpacks v1.38.0 ═══════╗**



**║ setup      │ nodejs\_22, npm-9\_x ║**



**║─────────────────────────────────║**



**║ install    │ npm i              ║**



**║─────────────────────────────────║**



**║ build      │ npm run build      ║**



**║─────────────────────────────────║**



**║ start      │ npm start          ║**



**╚═════════════════════════════════╝**



**\[internal] load build definition from Dockerfile**



**\[internal] load build definition from Dockerfile  ✔ 0 ms**



**\[internal] load build definition from Dockerfile**



**\[internal] load build definition from Dockerfile  ✔ 19 ms**



**\[internal] load metadata for ghcr.io/railwayapp/nixpacks:ubuntu-1745885067**



**\[internal] load metadata for ghcr.io/railwayapp/nixpacks:ubuntu-1745885067  ✔ 147 ms**



**\[internal] load .dockerignore**



**\[internal] load .dockerignore  ✔ 0 ms**



**\[internal] load .dockerignore**



**\[internal] load .dockerignore  ✔ 23 ms**



**\[internal] load build context  ✔ 0 ms**



**\[internal] load build context**



**\[internal] load build context  ✔ 2 s**



**\[stage-0 2/8] WORKDIR /app/  ✔ 0 ms – CACHED**



**\[stage-0  3/10] COPY .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix  ✔ 0 ms – CACHED**



**\[stage-0  4/10] RUN nix-env -if .nixpacks/nixpkgs-ffeebf0acf3ae8b29f8c7049cd911b9636efd7e7.nix \&\& nix-collect-garbage -d  ✔ 0 ms – CACHED**



**\[stage-0  5/10] COPY . /app/.**



**\[stage-0  5/10] COPY . /app/.  ✔ 775 ms**



**\[stage-0  6/10] RUN --mount=type=cache,id=s/5f9a36a0-9dcb-4302-8a5b-28d7b543f264-/root/npm,target=/root/.npm npm i**



**npm warn config production Use `--omit=dev` instead.**





**> cartissimo@1.0.0 postinstall**

**> npm run build**





**npm warn config production Use `--omit=dev` instead.**





**> cartissimo@1.0.0 build**

**> echo '🔄 Installation backend...' \&\& cd backend \&\& npm install \&\& echo '🔄 Installation frontend...' \&\& cd ../frontend \&\& rm -rf dist node\_modules \&\& npm ci \&\& echo '🔄 Build frontend...' \&\& npm run build \&\& echo '✅ Build terminé' \&\& ls -la dist/ \&\& echo '🔍 Vérification index.html:' \&\& head -20 dist/index.html**





**🔄 Installation backend...**



**npm warn config production Use `--omit=dev` instead.**





**added 166 packages, and audited 167 packages in 2s**





**22 packages are looking for funding**



  **run `npm fund` for details**





**1 low severity vulnerability**



**To address all issues, run:**

  **npm audit fix**



**Run `npm audit` for details.**



**🔄 Installation frontend...**



**npm warn config production Use `--omit=dev` instead.**



**npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.**



**npm warn deprecated stable@0.1.8: Modern JS already guarantees Array#sort() is a stable sort, so this library is deprecated. See the compatibility table on MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Array/sort#browser\_compatibility**



**npm warn deprecated @babel/plugin-proposal-class-properties@7.18.6: This proposal has been merged to the ECMAScript standard and thus this plugin is no longer maintained. Please use @babel/plugin-transform-class-properties instead.**



**npm warn deprecated rollup-plugin-terser@7.0.2: This package has been deprecated and is no longer maintained. Please use @rollup/plugin-terser**



**npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead**



**npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported**



**npm warn deprecated consolidate@0.15.1: Please upgrade to consolidate v1.0.0+ as it has been modernized with several long-awaited fixes implemented. Maintenance is supported by Forward Email at https://forwardemail.net ; follow/watch https://github.com/ladjs/consolidate for updates and release changelog**



**npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported**



**npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead**



**npm warn deprecated sourcemap-codec@1.4.8: Please use @jridgewell/sourcemap-codec instead**



**npm warn deprecated webpack-chain@6.5.1: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.**




 **warning**  



**entrypoint size limit: The following entrypoint(s) combined asset size exceeds the recommended limit (244 KiB). This can impact web performance.**

**Entrypoints:**

  **app (526 KiB)**

      **js/chunk-vendors.bb3d06b2.js**

      **css/app.3379de9c.css**

      **js/app.48d9a5f7.js**







 **warning**  







**webpack performance recommendations:** 

**You can limit the size of your bundles by using import() or require.ensure to lazy load some parts of your application.**

**For more info visit https://webpack.js.org/guides/code-splitting/**





  **File                                 Size               Gzipped**



  **dist/js/chunk-vendors.bb3d06b2.js    369.35 KiB         128.30 KiB**

  **dist/js/app.48d9a5f7.js              105.82 KiB         23.37 KiB**

  **dist/service-worker.js               1.82 KiB           0.65 KiB**

  **dist/css/app.3379de9c.css            50.93 KiB          8.49 KiB**



  **Images and other types of assets omitted.**

  **Build at: 2025-07-19T13:12:20.808Z - Hash: f590541094a13277 - Time: 12314ms**





 **DONE  Build complete. The dist directory is ready to be deployed.**



 **INFO  Check out deployment instructions at https://cli.vuejs.org/guide/deployment.html**

       



**✅ Build terminé**



**total 212**

**drwxr-xr-x 5 root root   4096 Jul 19 13:12 .**

**drwxr-xr-x 1 root root   4096 Jul 19 13:12 ..**

**drwxr-xr-x 2 root root   4096 Jul 19 13:12 css**

**-rw-r--r-- 1 root root 178852 Jul 19 13:12 favicon.ico**

**drwxr-xr-x 2 root root   4096 Jul 19 13:12 icons**

**-rw-r--r-- 1 root root   2867 Jul 19 13:12 index.html**

**drwxr-xr-x 2 root root   4096 Jul 19 13:12 js**

**-rw-r--r-- 1 root root    763 Jul 19 13:12 manifest.json**

**-rw-r--r-- 1 root root   1864 Jul 19 13:12 service-worker.js**



**🔍 Vérification index.html:**



**<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><!--\[if IE]><link rel="icon" href="/favicon.ico"><!\[endif]--><title>Cartissimo</title><meta name="theme-color" content="#4B95DE"><meta name="description" content="Application d'animations pour enfants"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Cartissimo"><link rel="apple-touch-icon" href="/icons/icon-152x152.png"><link rel="manifest" href="/manifest.json"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Cartissimo"><link rel="apple-touch-icon" href="/logo192.png"><link rel="apple-touch-icon" sizes="152x152" href="/logo152.png"><link rel="apple-touch-icon" sizes="180x180" href="/logo180.png"><link rel="apple-touch-icon" sizes="167x167" href="/logo167.png"><link rel="apple-touch-startup-image" href="/splash.png"><script defer="defer" src="/js/chunk-vendors.bb3d06b2.js"></script><script defer="defer" src="/js/app.48d9a5f7.js"></script><link href="/css/app.3379de9c.css" rel="stylesheet"><link rel="icon" type="image/svg+xml" href="/img/icons/favicon.svg"><link rel="icon" type="image/png" sizes="32x32" href="/img/icons/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/img/icons/favicon-16x16.png"><link rel="manifest" href="/manifest.json"><meta name="theme-color" content="#4DBA87"><meta name="apple-mobile-web-app-capable" content="no"><meta name="apple-mobile-web-app-status-bar-style" content="default"><meta name="apple-mobile-web-app-title" content="app-handicap-frontend"><link rel="apple-touch-icon" href="/img/icons/apple-touch-icon-152x152.png"><link rel="mask-icon" href="/img/icons/safari-pinned-tab.svg" color="#4DBA87"><meta name="msapplication-TileImage" content="/img/icons/msapplication-icon-144x144.png"><meta name="msapplication-TileColor" content="#000000"></head><body><noscript><strong>Nous sommes désolés mais Cartissimo ne fonctionne pas correctement sans JavaScript activé. Veuillez l'activer pour continuer.</strong></noscript><div id="app"></div><script>if ('serviceWorker' in navigator) {**

        **window.addEventListener('load', () => {**

          **navigator.serviceWorker.register('/service-worker.js')**

            **.then(registration => {**

              **console.log('ServiceWorker enregistré avec succès:', registration.scope);**

            **})**

            **.catch(error => {**

              **console.log('Erreur d\\'enregistrement du ServiceWorker:', error);**

            **});**

        **});**

      **}</script></body></html>**



**\[stage-0  8/10] RUN --mount=type=cache,id=s/5f9a36a0-9dcb-4302-8a5b-28d7b543f264-node\_modules/cache,target=/app/node\_modules/.cache npm run build  ✔ 30 s**



**\[stage-0  9/10] RUN printf '\\nPATH=/app/node\_modules/.bin:$PATH' >> /root/.profile**



**\[stage-0  9/10] RUN printf '\\nPATH=/app/node\_modules/.bin:$PATH' >> /root/.profile  ✔ 360 ms**



**\[stage-0 10/10] COPY . /app**



**\[stage-0 10/10] COPY . /app  ✔ 544 ms**



**exporting to docker image format**



**exporting to image**



**\[auth] sharing credentials for production-europe-west4-drams3a.railway-registry.com**



**\[auth] sharing credentials for production-europe-west4-drams3a.railway-registry.com  ✔ 1 ms**



**importing to docker**



**importing to docker  ✔ 23 s**



**=== Successfully Built! ===**



**Run:**



**docker run -it production-europe-west4-drams3a.railway-registry.com/5f9a36a0-9dcb-4302-8a5b-28d7b543f264:19a5d786-2e43-4810-9da4-1dc1d0561604**



**Build time: 100.88 seconds**



 



**====================**



**Starting Healthcheck**



**====================**





**Path: /api/health**



**Retry window: 5m0s**



 



**\[1/1] Healthcheck succeeded!**

