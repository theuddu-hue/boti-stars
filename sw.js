const C = 'boti-202611120606';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(['./', 'manifest.webmanifest', 'icon-192.png']).catch(() => {}))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  const fresh = u.pathname.endsWith('/') || u.pathname.endsWith('index.html') || u.pathname.endsWith('manifest.json');
  e.respondWith(fresh
    ? fetch(e.request).then(r => { const copy = r.clone(); caches.open(C).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request))
    : caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { const copy = r.clone(); if (r.ok) caches.open(C).then(c => c.put(e.request, copy)); return r; })));
});
