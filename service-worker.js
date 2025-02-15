// Nama cache dengan versi terbaru untuk mencegah konflik
const CACHE_NAME = 'habit-tracker-cache-v3'; 

// Daftar file statis yang akan di-cache
const CACHE_ASSETS = [
  './',
  './index.html',
  './src.js',
  './manifest.json'
];

// Event Install: Simpan file ke cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching files...');
      return cache.addAll(CACHE_ASSETS);
    })
  );
});

// Event Activate: Hapus cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Event Fetch: Mengambil file dari jaringan atau cache
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return; // Hindari cache request yang tidak perlu
  event.respondWith(
    caches.match(event.request).then((cacheResponse) => {
      return cacheResponse || fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch(() => {
      return caches.match('./index.html'); // Pastikan halaman tetap bisa diakses
    })
  );
});

