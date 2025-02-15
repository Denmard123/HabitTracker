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
  const { completedData, failedData } = req.body;

  console.log("Data yang diterima di server:", req.body);

  if (!completedData || !failedData || !Array.isArray(completedData) || !Array.isArray(failedData)) {
    return res.status(400).json({ success: false, message: 'Data tidak lengkap atau format tidak valid!' });
  }

  // Hanya menyimpan data terbaru
  rekapitulasiData = [];

  completedData.forEach(item => {
    rekapitulasiData.push({
      habitName: item.habitName,
      status: 'Selesai',
      time: item.time,
    });
  });

  failedData.forEach(item => {
    rekapitulasiData.push({
      habitName: item.habitName,
      status: 'Gagal',
      time: item.time,
    });
  });

  res.status(200).json({ success: true, message: "Data terbaru telah disimpan!" });
});

// Endpoint untuk mendapatkan data rekapitulasi
app.get('/get-rekapitulasi', (req, res) => {
  res.status(200).json({ rekapitulasiData });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
