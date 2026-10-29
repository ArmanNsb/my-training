/* Bump SHELL on every deploy so phones pick up the new files */
const PREFIX='mytraining-';
const SHELL='mytraining-shell-v4-bilingual';
const CDN='mytraining-cdn-v4';
const FILES=['./','index.html','style.css','app.js','manifest.webmanifest','icon.svg','cloud-config.js'];
const CDN_HOSTS=['fonts.googleapis.com','fonts.gstatic.com','raw.githubusercontent.com'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(SHELL).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith(PREFIX)&&k!==SHELL&&k!==CDN).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||r.headers.has('Authorization'))return; // never touch API calls
  const u=new URL(r.url);

  /* App files: serve from cache instantly, refresh in the background */
  if(u.origin===location.origin){
    e.respondWith(caches.open(SHELL).then(async c=>{
      const hit=await c.match(r,{ignoreSearch:true});
      const net=fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}).catch(()=>null);
      if(hit){e.waitUntil(net);return hit}
      const res=await net;
      if(res)return res;
      return r.mode==='navigate'?(await c.match('index.html'))||Response.error():Response.error();
    }));
    return;
  }

  /* Fonts and exercise images: cache-first, they never change */
  if(CDN_HOSTS.includes(u.hostname)){
    e.respondWith(caches.open(CDN).then(async c=>{
      const hit=await c.match(r);if(hit)return hit;
      try{const res=await fetch(r);if(res.ok||res.type==='opaque')c.put(r,res.clone());return res}
      catch(err){return Response.error()}
    }));
  }
});