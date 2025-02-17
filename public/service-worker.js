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

  // Hindari caching request dinamis seperti API
  if (request.url.includes('/get-rekapitulasi')) {
    console.log('🚀 Melewati cache untuk request:', request.url);
    event.respondWith(fetch(request));
    return;
  }

  // Caching untuk file statis
  event.respondWith(
    caches.match(request).then((cacheResponse) => {
      // Jika file ditemukan dalam cache, gunakan cache tersebut
      if (cacheResponse) {
        console.log(`🔧 Mengambil dari cache: ${request.url}`);
        return cacheResponse;
      }

      // Jika tidak ada dalam cache, ambil dari jaringan dan simpan ke cache
      return fetch(request).then((networkResponse) => {
        // Pastikan response bukan untuk file dinamis sebelum disimpan ke cache
        if (networkResponse && networkResponse.status === 200) {
          // Buat salinan dari networkResponse untuk disalin ke cache
          const networkResponseClone = networkResponse.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            // Simpan salinan ke cache
            cache.put(request, networkResponseClone);
          });
        }
        // Kembalikan respons asli kepada pengguna
        return networkResponse;
      }).catch(() => {
        // Jika jaringan gagal, fallback ke halaman offline
        console.error('⚠️ Fetch gagal, menampilkan halaman offline sebagai cadangan.');
        return caches.match('./index.html');
      });
    })
  );
});
