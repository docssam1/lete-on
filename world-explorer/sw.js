const CACHE='gfield-world-explorer-v8';
const SHELL=['./','./index.html','./styles.css','./ui-extras.css','./village.css','./app.js','./village.js','./countries.js','./character-data.js','./character.js','./vendor/three.module.js','./vendor/three.core.js','./vendor/d3.js','./vendor/topojson-client.js','./data/countries-110m.json','./assets/world-explorer-intro.png','./assets/world-explorer-intro.mp4','./manifest.webmanifest','./icons/app-icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;}).catch(()=>event.request.mode==='navigate'?caches.match('./index.html'):Response.error())));
});
