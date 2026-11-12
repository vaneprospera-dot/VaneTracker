// Service Worker para Vanessa App - VaneTracker v4.0 Full Production
const CACHE_NAME = "vanetracker-v4-0-prod";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Limpiando cache antiguo:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia Network First: Siempre busca la versión más reciente en la red
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || event.request.url.includes("script.google.com") || event.request.url.includes("/api/")) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
