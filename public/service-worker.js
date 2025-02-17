// Nama cache dengan versi terbaru untuk mencegah konflik
const CACHE_NAME = 'habit-tracker-cache-v4'; 

// Daftar file statis yang akan di-cache
const CACHE_ASSETS = [
  './',
  './index.html',
  './src.js',
  './manifest.json'
];

// Event Install: Simpan file ke cache
self.addEventListener('install', (event) => {
  console.log('📥 Service Worker: Menginstal dan caching aset...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_ASSETS);
    })
  );
  self.skipWaiting(); // Langsung aktif tanpa menunggu reload
});

// Event Activate: Hapus cache lama & klaim kontrol atas semua klien
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker: Mengaktifkan dan membersihkan cache lama...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log(`🗑️ Menghapus cache lama: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Memastikan SW segera mengambil kontrol
});

// Event Fetch: Mengambil file dari jaringan atau cache
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Hindari caching untuk request POST
  if (request.method === 'POST') {
    console.log('🚫 Melewatkan cache untuk POST request:', request.url);
    event.respondWith(fetch(request));
    return;
  }

  // Caching untuk file statis
  event.respondWith(
    caches.match(request).then((cacheResponse) => {
      if (cacheResponse) {
        console.log(`🔧 Mengambil dari cache: ${request.url}`);
        return cacheResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const networkResponseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        console.error('⚠️ Fetch gagal, menampilkan halaman offline.');
        return caches.match('./index.html');
      });
    })
  );
});

