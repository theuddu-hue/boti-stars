const C = 'boti-202611131724', VC = 'boti-voice';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(['./', 'manifest.webmanifest', 'icon-192.png']).catch(() => {}))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C && k !== VC).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (u.pathname.endsWith('version.json')) return;                       // always straight from the network
  const page = u.pathname.endsWith('/') || u.pathname.endsWith('index.html'), fresh = page || u.pathname.endsWith('manifest.json');
  if (fresh) {
    const key = page ? './' : e.request;
    e.respondWith(fetch(u.href, { cache: 'no-cache' }).then(r => { if (r.ok) { const copy = r.clone(); caches.open(C).then(c => c.put(key, copy)); } return r; }).catch(() => caches.match(key).then(hit => hit || caches.match(e.request, { ignoreSearch: true }))));
    return;
  }
  const store = u.pathname.endsWith('.pack') ? VC : C;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { const copy = r.clone(); if (r.ok) caches.open(store).then(c => c.put(e.request, copy)); return r; })));
});
