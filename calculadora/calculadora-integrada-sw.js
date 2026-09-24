const CACHE='calculadora-integrada-v3-icon-iluminart';
const CORE=['./calculadora-integrada.html','./calculadora-integrada.webmanifest','./calculadora-integrada-icon-192.png','./calculadora-integrada-icon-512.png','./calculadora-integrada-apple-touch-icon.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).catch(()=>{}));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(fetch(event.request).then(response=>{const clone=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,clone)).catch(()=>{});return response;}).catch(()=>caches.match(event.request).then(r=>r||caches.match('./calculadora-integrada.html'))));});
