// Install event untuk menyimpan file yang dibutuhkan di cache
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('habit-tracker-cache').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',  
          '/src.js'      
        ]);
      })
    );
  });
  
  // Aktifkan event untuk membersihkan cache lama yang tidak diperlukan
  self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['habit-tracker-cache'];
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName); // Menghapus cache yang tidak digunakan
            }
          })
        );
      })
    );
  });
  
  // Fetch event untuk mengelola request ke jaringan dan cache
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Jika file ada di cache, kembalikan dari cache
        if (response) {
          return response;
        }
  
        // Jika file tidak ada di cache, ambil dari jaringan dan cache respons
        return fetch(event.request).then((networkResponse) => {
          // Caching respons untuk permintaan jaringan
          return caches.open('habit-tracker-cache').then((cache) => {
            // Cache respons baru dari jaringan
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  });
  