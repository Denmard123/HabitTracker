// Nama cache dengan versi untuk memastikan pembaruan cache
const CACHE_NAME = 'habit-tracker-cache-v2'; // Perbarui versi setiap kali ada perubahan

// Daftar file yang akan di-cache
const CACHE_ASSETS = [
  './',
  './index.html',
  './src.js',
  './manifest.json',
];

// Event Install: Tambahkan file ke cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching files...');
      return cache.addAll(CACHE_ASSETS);
    })
  );
});

// Event Activate: Hapus cache lama yang tidak digunakan
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName); // Hapus cache yang lama
          }
        })
      );
    })
  );
});

// Event Fetch: Mengambil file dari jaringan atau cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Jika file berhasil diambil dari jaringan, cache respons baru
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // Jika gagal mengambil dari jaringan, gunakan cache
        return caches.match(event.request);
      })
  );
});
