const CACHE_NAME="venaria-v3";
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(["./","./index.html","./app.js","./manifest.json","./html5-qrcode.min.js"])));});
self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});