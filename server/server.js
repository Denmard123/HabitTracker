const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Data sementara untuk menyimpan rekapitulasi
let rekapitulasiData = [];

// Middleware untuk parsing JSON
app.use(express.json());

// Middleware untuk melayani file statis (misalnya HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.css') || filePath.endsWith('.json')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache file statis untuk 1 tahun
    }
  }
}));

// **Pastikan service worker bisa diakses oleh browser**
app.get('/service-worker.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, '../service-worker.js'));
});

// Endpoint untuk menyimpan data kebiasaan
app.post('/save-habits', (req, res) => {
  process.nextTick(() => {
    const { completedData, failedData } = req.body;
    console.log("Data yang diterima di server:", req.body);
  
    if (!completedData || !failedData || !Array.isArray(completedData) || !Array.isArray(failedData)) {
      return res.status(400).json({ success: false, message: 'Data tidak lengkap atau format tidak valid!' });
    }
  
    rekapitulasiData = [...completedData.map(item => ({ ...item, status: 'Selesai' })), 
                        ...failedData.map(item => ({ ...item, status: 'Gagal' }))];
  
    res.status(200).json({ success: true, message: "Data terbaru telah disimpan!" });
  });
});


// Endpoint untuk mendapatkan data rekapitulasi
app.get('/get-rekapitulasi', (req, res) => {
  res.status(200).json({ rekapitulasiData });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
