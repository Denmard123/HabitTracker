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
  // Jika request ke API `/get-rekapitulasi`, gunakan strategi network-first
  if (event.request.url.includes('/get-rekapitulasi')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else {
    // Untuk file statis, gunakan cache-first
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});
