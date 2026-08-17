const CACHE_NAME = 'agrocad-v2'; // Subimos la versión
const urlsToCache = [
  '/',
  '/index.html',
  '/icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
  'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Fuerza la instalación inmediata
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.log('Error de caché:', err))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          // Borra la caché vieja si actualizas la app
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // PARCHE VITAL: Ignorar extensiones de Chrome y esquemas que no sean HTTP/HTTPS
  if (!event.request.url.startsWith('http')) {
      return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve el archivo de la memoria o lo busca en internet si no está
        return response || fetch(event.request).catch(() => {
            console.log('Estás offline y el recurso no está en caché');
        });
      })
  );
});
